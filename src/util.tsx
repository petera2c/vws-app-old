import { useCallback, useEffect, useRef } from "react";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  query,
} from "@firebase/firestore";
import {
  get,
  limitToLast,
  onValue,
  orderByChild,
  query as query2,
  ref,
  set,
} from "@firebase/database";
import { getAuth, sendEmailVerification, signOut } from "@firebase/auth";
import { db, db2 } from "./config/db_init";
import reactStringReplace from "react-string-replace";
import dayjs from "dayjs";
import { message, Modal } from "antd";
import UserBasicInfo from "./types/UserBasicInfo";
import { setUserOnlineStatus } from "./app/util";

export const blockUser = async (userID: string, userIDToBlock: string) => {
  await set(ref(db2, "block_check_new/" + userID + "/" + userIDToBlock), true);

  return message.success("User has been blocked");
};

export const calculateKarma = (usereBasicInfo: UserBasicInfo | undefined) => {
  return usereBasicInfo?.karma ? usereBasicInfo?.karma : 0;
};

export const isUserKarmaSufficient = (
  userBasicInfo: UserBasicInfo | undefined
) => {
  if (calculateKarma(userBasicInfo) <= -50) return false;
  else return true;
};

export const capitolizeFirstChar = (string: any) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

export const capitolizeFirstLetterOfEachWord = (string: any) => {
  return string
    .toLowerCase()
    .replace(/(^\w{1})|(\s{1}\w{1})/g, (match: any) => match.toUpperCase());
};

export const chatQueueEmptyListener = (isMounted: any, setQueueLength: any) => {
  const unsubscribe = onSnapshot(
    query(collection(db, "chat_queue"), limit(10)),
    (snapshot) => {
      if (!isMounted()) return;

      if (snapshot.docs && snapshot.docs.length > 0)
        setQueueLength(snapshot.docs.length);
      else setQueueLength(-1);
    }
  );

  return unsubscribe;
};

export const combineObjectWithID = (id: string, object: any) => {
  object.id = id;
  return object;
};

export const countdown = (
  isMounted: any,
  dayjsTimeout: any,
  setTimeout: any,
  setTimeOutFormatted?: any
) => {
  if (isMounted()) {
    setTimeout((oldUserVentTimeOut: any) => {
      if (setTimeOutFormatted) {
        setTimeOutFormatted(formatSeconds(oldUserVentTimeOut));
      }
      if (oldUserVentTimeOut) return oldUserVentTimeOut - 1;
      else return Math.round(Number(dayjs(dayjsTimeout).diff(dayjs())) / 1000);
    });
  }
};

export const displayNameErrors = (displayName: string) => {
  if (getInvalidCharacters(displayName)) {
    return message.error(
      "These characters are not allowed in your display name. " +
        getInvalidCharacters(displayName)
    );
  } else if (displayName.length > 15)
    return message.error("Display name is too long :'(");
  else return false;
};

export const formatSeconds = (userVentTimeOut: any) => {
  const hours = Math.floor(userVentTimeOut / 3600);
  const minutes = Math.floor((userVentTimeOut % 3600) / 60);
  const seconds = (userVentTimeOut % 3600) % 60;

  return (
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
};

export const getEndAtValueTimestamp = (array: any) => {
  const recurse: any = (myArray: any) => {
    if (
      myArray &&
      myArray[myArray.length - 1] &&
      myArray[myArray.length - 1].useToPaginate === false
    ) {
      return recurse(array.slice(0, -1));
    } else if (myArray && myArray[myArray.length - 1])
      return myArray[myArray.length - 1].doc;
    else return 10000000000000;
  };

  const startAt = recurse(array);

  return startAt;
};

export const getEndAtValueTimestampAsc = (array: any) => {
  const recurse: any = (myArray: any) => {
    if (
      myArray &&
      myArray[myArray.length - 1] &&
      myArray[myArray.length - 1].useToPaginate === false
    ) {
      return recurse(array.slice(0, -1));
    } else if (myArray && myArray[myArray.length - 1])
      return myArray[myArray.length - 1].doc;
    else return 0;
  };

  const startAt = recurse(array);

  return startAt;
};

export const getEndAtValueTimestampFirst = (array: any) => {
  let startAt = 10000000000000;

  if (array && array[0] && array[0].doc) startAt = array[0].doc;
  return startAt;
};

const getInvalidCharacters = (displayName: string) => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

export const getIsUserOnline = (setIsUserOnline: any, userID?: string) => {
  const dbRef = ref(db2, "status/" + userID);

  onValue(dbRef, (snapshot) => {
    if (snapshot.val() && snapshot.val().state === "online")
      setIsUserOnline(snapshot.val());
    else if (snapshot.val() && snapshot.val().state === "offline") {
      setIsUserOnline(snapshot.val());
    }
  });

  return dbRef;
};

export const getTotalOnlineUsers = (callback: any) => {
  get(ref(db2, "total_online_users2")).then((doc: any) => {
    callback(doc.val());
  });

  return;
};

export const getUserBasicInfo = async (callback: any, userID: string) => {
  if (!userID) return {};

  const authorDoc = await getDoc(doc(db, "users_display_name", userID));

  callback(authorDoc.exists() ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const getUserAvatars = (isMounted: any, setFirstOnlineUsers: any) => {
  get(query2(ref(db2, "status"), limitToLast(3), orderByChild("index"))).then(
    async (snapshot) => {
      let usersOnline: any = [];

      snapshot.forEach((data) => {
        if (data.val().state === "online") {
          usersOnline.push({
            lastOnline: data.val().last_online,
            userID: data.key,
          });
        }
      });

      const onlineUsersAvatars = [];

      for (let i in usersOnline) {
        const userBasicInfoDoc = await getDoc(
          doc(db, "users_display_name", usersOnline[i].userID)
        );

        if (userBasicInfoDoc.data())
          onlineUsersAvatars.unshift({
            id: userBasicInfoDoc.id,
            ...userBasicInfoDoc.data(),
          });
      }

      if (isMounted()) setFirstOnlineUsers(onlineUsersAvatars);
    }
  );
};

export const hasUserBlockedUser = async (
  isMounted: any,
  userID: string,
  userID2: string,
  callback: any
) => {
  const block1 = await get(
    ref(db2, "block_check_new/" + userID + "/" + userID2)
  );
  const block2 = await get(
    ref(db2, "block_check_new/" + userID2 + "/" + userID)
  );

  if (!isMounted()) return;

  if (block1.val() || block2.val()) return callback(true);
  else return callback(false);
};

export const getIsMobileOrTablet = () => window.screen.width < 940;

export const isPageActive = (page: string, pathname: string) => {
  if (page === pathname) return " active ";
  else return "";
};

export const getIsPageActive = (page: string, pathname: string) => {
  if (page === pathname) return " active ";
  else return "";
};

export const isUserAccountNew = (userBasicInfo?: UserBasicInfo) => {
  if (!userBasicInfo) return false;

  const seconds = Math.round(
    dayjs().diff(dayjs(userBasicInfo.server_timestamp)) / 1000
  );

  const hours = Math.floor(seconds / 3600);

  if (hours > 72) return false;
  else return true;
};

export const signOut2 = (userID: string) => {
  setTimeout(() => {
    setUserOnlineStatus("offline", userID);

    signOut(getAuth()).then(() => {
      message.success("Sign out successful :)");
    });
  }, 200);
};

export const soundNotify = (sound = "bing") => {
  let audio = new Audio("/static/" + sound + ".mp3");

  audio.play();
};

export const urlify = (text: string) =>
  reactStringReplace(text, /(https?:\/\/[^\s]+)/g, (match) => (
    <a
      className="button-1 no-bold no-hover"
      href={match}
      rel="noreferrer"
      target="_blank"
    >
      {match}
    </a>
  ));

export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
};

export const userSignUpProgress = (user: any, noAlert?: boolean) => {
  if (!user) {
    return "NSI";
  } else if (!user.emailVerified) {
    if (!noAlert) {
      user.reload();
      sendEmailVerification(user)
        .then(() => {
          Modal.info({
            title: "Verify Email",
            centered: true,
            content: "We have re-sent you a verification email :)",
          });
        })
        .catch((err) => {
          Modal.error({
            title: "Verify Email",
            content: err,
          });
        });
    }
    return "NVE";
  } else return false;
};

export const userSignUpProgressFunction = (setStarterModal: any, user: any) => {
  if (!user) {
    return () => () => setStarterModal(true);
  } else if (!user.emailVerified) {
    return () => () => {
      user.reload();
      sendEmailVerification(user)
        .then(() => {
          return Modal.info({
            title: "Verify Email",
            centered: true,
            content: "We have re-sent you a verification email :)",
          });
        })
        .catch((err) => {
          return Modal.error({
            title: "Verify Email",
            content: err,
          });
        });
    };
  } else return false;
};

export const viewTagFunction = (tag: string) => {
  if (!tag) return;
  else return capitolizeFirstLetterOfEachWord(tag.replace(/_/g, " "));
};
