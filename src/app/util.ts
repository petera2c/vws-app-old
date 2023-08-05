import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  endAt,
  get,
  limitToLast,
  onDisconnect,
  onValue,
  orderByChild,
  query as query2,
  ref,
  serverTimestamp,
  set,
} from "@firebase/database";
import { db, db2 } from "../config/db_init";
import dayjs from "dayjs";

import { getEndAtValueTimestamp } from "../util";
import Vent from "@/types/Vent";

export const getIsUsersBirthday = async (
  isMounted: any,
  setIsUsersBirthday: any,
  userID: string
) => {
  const userInfoDoc = await getDoc(doc(db, "users_info", userID));

  if (
    userInfoDoc.data() &&
    userInfoDoc.data()?.birth_date &&
    dayjs(userInfoDoc.data()?.birth_date).format("MMDD") ===
      dayjs().format("MMDD") &&
    (!userInfoDoc.data()?.last_birthday ||
      dayjs().diff(dayjs(userInfoDoc.data()?.last_birthday), "day") >= 365)
  ) {
    if (isMounted.current) setIsUsersBirthday(true);
    await updateDoc(doc(db, "users_info", userInfoDoc.id), {
      last_birthday: Timestamp.now().toMillis(),
    });
  }
};

export const getIsUserSubscribed = async (
  isMounted: any,
  setUserSubscription: any,
  userID: string
) => {
  const userSubscriptionDoc = await getDoc(
    doc(db, "user_subscription", userID)
  );

  if (userSubscriptionDoc.data() && isMounted.current)
    setUserSubscription(userSubscriptionDoc.data());
};

export const newRewardListener = (
  isMounted: any,
  setNewReward: any,
  userID: string,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "rewards"),
      where("userID", "==", userID),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (
        querySnapshot.docs &&
        querySnapshot.docs[0] &&
        isMounted.current
      ) {
        setNewReward(() => {
          return {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          };
        });
      }
    }
  );

  return unsubscribe;
};

export const setUserOnlineStatus = async (status: any, uid: any) => {
  if (status === "online")
    await set(ref(db2, "status/" + uid), {
      index: serverTimestamp(),
      state: status,
    });
  else
    await set(ref(db2, "status/" + uid), {
      last_online: serverTimestamp(),
      state: status,
    });

  return;
};

export const setIsUserOnlineToDatabase = (uid: any) => {
  if (!uid) return;

  const connectedRef = ref(db2, ".info/connected");
  const userStatusDatabaseRef = ref(db2, "status/" + uid);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      set(userStatusDatabaseRef, {
        index: dayjs().valueOf(),
        state: "online",
      });
      onDisconnect(userStatusDatabaseRef).set({
        last_online: serverTimestamp(),
        state: "offline",
      });
    }
  });
};

export const getVents = async (
  isMounted: any,
  setCanLoadMore: any,
  setVents: any,
  user: any,
  vents: any,
  whatPage: any
) => {
  let startAt = getEndAtValueTimestamp(vents);

  let snapshot;
  let snapshotRTDB;
  if (whatPage === "recent") {
    snapshot = await getDocs(
      query(
        collection(db, "vents"),
        orderBy("server_timestamp", "desc"),
        startAfter(startAt),
        limit(10)
      )
    );
  } else if (whatPage === "my-feed" && user) {
    if (vents && vents.length > 0) {
      snapshotRTDB = await get(
        query2(
          ref(db2, "feed/" + user.uid),
          endAt(
            vents[vents.length - 1].server_timestamp,
            vents[vents.length - 1].id
          ),
          limitToLast(10),
          orderByChild("server_timestamp")
        )
      );
    } else
      snapshotRTDB = await get(
        query2(
          ref(db2, "feed/" + user.uid),
          limitToLast(10),
          orderByChild("server_timestamp")
        )
      );
  } else {
    let trending_option = "trending_score_day";
    if (whatPage === "trending-week") trending_option = "trending_score_week";
    if (whatPage === "trending-month") trending_option = "trending_score_month";

    snapshot = await getDocs(
      query(
        collection(db, "vents"),
        orderBy(trending_option, "desc"),
        startAfter(startAt),
        limit(10)
      )
    );
  }
  if (!isMounted()) return;

  if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc: any) => ({
      doc,
      id: doc.id,
      ...doc.data(),
    }));

    if (newVents.length < 9) setCanLoadMore(false);
    if (vents) {
      return setVents((oldVents: any) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else if (snapshotRTDB && snapshotRTDB.val()) {
    let newVents: any[] = [];

    snapshotRTDB.forEach((data: any) => {
      newVents.unshift({
        id: data.key,
        server_timestamp: data.val().server_timestamp,
      });
    });

    if (vents && vents.length > 0) {
      newVents.shift();
    }

    if (isMounted()) {
      if (newVents.length < 10) setCanLoadMore(false);

      if (vents) {
        return setVents((oldVents: any) => {
          if (oldVents) return [...oldVents, ...newVents];
          else return newVents;
        });
      } else {
        return setVents(newVents);
      }
    }
  } else return setCanLoadMore(false);
};

export const getWhatPage = (pathname: string) => {
  if (pathname === "/") return "recent";
  else if (pathname === "/my-feed") return "my-feed";
  else if (pathname === "/recent") return "recent";
  else if (pathname === "/trending") return "trending";
  else if (pathname === "/trending/this-week") return "trending-week";
  else if (pathname === "/trending/this-month") return "trending-month";

  return "";
};

export const newVentListener = (
  isMounted: () => boolean,
  setWaitingVents: any,
  whatPage: string,
  first = true
) => {
  if (whatPage !== "recent") return;

  const unsubscribe = onSnapshot(
    query(
      collection(db, "vents"),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (querySnapshot) => {
      if (first) {
        first = false;
      } else if (querySnapshot.docs && querySnapshot.docs[0]) {
        if (
          querySnapshot.docChanges()[0].type === "added" ||
          querySnapshot.docChanges()[0].type === "removed"
        ) {
          if (isMounted())
            setWaitingVents((vents: Vent[]) => [
              ...vents,
              {
                doc: querySnapshot.docs[0],
                id: querySnapshot.docs[0].id,
                ...querySnapshot.docs[0].data(),
              },
            ]);
        }
      }
    }
  );

  return unsubscribe;
};
