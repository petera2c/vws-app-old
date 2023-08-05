import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  get,
  limitToFirst,
  orderByKey,
  ref,
  query as query2,
  set,
  startAfter as startAfter2,
} from "@firebase/database";
import {
  getAuth,
  sendEmailVerification,
  updateEmail,
  updateProfile,
} from "@firebase/auth";

import { db, db2 } from "../../config/db_init";

import { message } from "antd";

import { displayNameErrors, getEndAtValueTimestamp } from "../../util";
import Comment from "@/types/Comment";
import Vent from "@/types/Vent";
import UserBasicInfo from "@/types/UserBasicInfo";

const deleteAccountField = async (field: any, userID: string) => {
  await updateDoc(doc(db, "users_info", userID), {
    [field]: deleteField(),
  });
};

export const deleteAccountAndAllData = async () => {
  await getAuth().currentUser?.delete();

  message.success("Your account is deleted");
};

export const followOrUnfollowUser = async (
  isMounted: any,
  option: any,
  setIsFollowing: any,
  userID: string,
  userIDToFollow: string
) => {
  await set(
    ref(db2, "following/" + userID + "/" + userIDToFollow),
    option ? option : null
  );

  if (isMounted()) setIsFollowing(option);
  message.success(
    option ? "Followed Successfully :)" : "Unfollowed Successfully :)"
  );
};

export const getBlockedUsers = async (
  blockedUsers: any,
  isMounted: any,
  setBlockedUsers: any,
  setCanLoadMore: any,
  userID: string
) => {
  const snapshot = await get(
    query2(
      ref(db2, "block_check_new/" + userID),
      orderByKey(),
      startAfter2(
        blockedUsers && blockedUsers.length > 0
          ? blockedUsers[blockedUsers.length - 1]
          : ""
      ),
      limitToFirst(10)
    )
  );

  if (!isMounted()) return;

  let newBlockedUsers: any = [];

  for (let index in snapshot.val()) {
    // @ts-ignore
    if (index === 0 && blockedUsers && blockedUsers.length > 0) continue;
    newBlockedUsers.push(index);
  }

  if (newBlockedUsers.length > 0) {
    if (newBlockedUsers.length < 10) setCanLoadMore(false);
    else setCanLoadMore(true);

    if (blockedUsers && blockedUsers.length > 0) {
      return setBlockedUsers((oldBlockedUsers: any[]) => {
        if (oldBlockedUsers) return [...oldBlockedUsers, ...newBlockedUsers];
        else return newBlockedUsers;
      });
    } else {
      return setBlockedUsers(newBlockedUsers);
    }
  } else setCanLoadMore(false);
};

export const getIsFollowing = async (
  isMounted: any,
  setIsFollowing: any,
  userID: string,
  userIDToFollow: string
) => {
  const isFollowingDoc = await get(
    ref(db2, "following/" + userID + "/" + userIDToFollow)
  );

  if (isMounted()) setIsFollowing(isFollowingDoc.val());
};

export const getUser = async (callback: any, userID: string) => {
  if (!userID) {
    message.error("Reload the page please. An unexpected error has occurred.");
    return {};
  }

  const authorDoc = await getDoc(doc(db, "users_info", userID));

  callback(authorDoc.exists() ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const getUsersComments = async (
  isMounted: any,
  search: string,
  setCanLoadMoreComments: any,
  setComments: any,
  comments: Comment[]
) => {
  let startAt = getEndAtValueTimestamp(comments);

  const snapshot = await getDocs(
    query(
      collection(db, "comments"),
      where("userID", "==", search),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (!isMounted()) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newComments = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      doc,
    }));

    if (newComments.length < 10) setCanLoadMoreComments(false);
    if (comments) {
      return setComments((oldComments: Comment[]) => {
        if (oldComments) return [...oldComments, ...newComments];
        else return newComments;
      });
    } else {
      return setComments(newComments);
    }
  } else return setCanLoadMoreComments(false);
};

export const getUsersVents = async (
  isMounted: any,
  search: string,
  setCanLoadMoreVents: any,
  setVents: any,
  vents: Vent[]
) => {
  let startAt = getEndAtValueTimestamp(vents);

  const snapshot = await getDocs(
    query(
      collection(db, "vents"),
      where("userID", "==", search),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (!isMounted()) return;

  if (snapshot.docs && snapshot.docs.length > 0) {
    let newVents = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      doc,
    }));

    if (newVents.length < 10) setCanLoadMoreVents(false);
    if (vents) {
      return setVents((oldVents: Vent[]) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else return setCanLoadMoreVents(false);
};

export const unblockUser = async (
  blockedUserID: string,
  setBlockedUsers: any,
  userID: string
) => {
  await set(ref(db2, "block_check_new/" + userID + "/" + blockedUserID), null);

  setBlockedUsers((blockedUsers: any) => {
    blockedUsers.splice(
      blockedUsers.findIndex(
        (blockedUserID2: string) => blockedUserID2 === blockedUserID
      ),
      1
    );
    return [...blockedUsers];
  });
  message.success("User has been unblocked :)");
};

export const updateUser = async (
  bio: any,
  birthDate: any,
  confirmPassword: any,
  displayName: any,
  education: any,
  email: any,
  gender: any,
  kids: any,
  newPassword: any,
  partying: any,
  politics: any,
  pronouns: any,
  religion: any,
  setUserBasicInfo: any,
  user: any,
  userInfo: any
) => {
  let changesFound = false;
  let birthdayChanged = false;

  if (userInfo.birth_date && !birthDate) birthdayChanged = true;
  if (birthDate)
    if (userInfo.birth_date !== birthDate.valueOf()) birthdayChanged = true;

  if (
    birthdayChanged ||
    userInfo.bio !== bio ||
    userInfo.education !== education ||
    userInfo.gender !== gender ||
    userInfo.kids !== kids ||
    userInfo.partying !== partying ||
    userInfo.politics !== politics ||
    userInfo.pronouns !== pronouns ||
    userInfo.religion !== religion
  ) {
    if (gender && gender.length > 15)
      return message.error("Gender can only be a maximum of 15 characters.");
    if (pronouns && pronouns.length > 15)
      return message.error("Pronouns can only be a maximum of 15 characters.");
    if (bio && bio.length > 500)
      return message.error("Bio has a maximum of 500 characters");

    changesFound = true;

    if (education === undefined) deleteAccountField("education", user.uid);
    if (kids === undefined) deleteAccountField("kids", user.uid);
    if (partying === undefined) deleteAccountField("partying", user.uid);
    if (politics === undefined) deleteAccountField("politics", user.uid);
    if (religion === undefined) deleteAccountField("religion", user.uid);

    setDoc(
      doc(db, "users_info", user.uid),
      {
        bio,
        birth_date: birthDate ? birthDate.valueOf() : null,
        gender,
        pronouns,
        ...whatInformationHasChanged(
          education,
          kids,
          partying,
          politics,
          religion,
          userInfo
        ),
      },
      { merge: true }
    );

    message.success("Your account information has been changed");
  }

  if (displayName && displayName !== user.displayName) {
    if (displayNameErrors(displayName)) return;

    changesFound = true;

    updateProfile(user, {
      displayName,
    })
      .then(async () => {
        await updateDoc(doc(db, "users_display_name", user.uid), {
          displayName,
        });

        setUserBasicInfo((oldInfo: UserBasicInfo) => {
          let temp = { ...oldInfo };
          temp.displayName = displayName;
          return temp;
        });

        message.success("Display name updated!");
      })
      .catch((error) => {
        message.error(error.message);
      });
  }

  if (email && email !== user.email) {
    changesFound = true;
    updateEmail(user, email)
      .then(() => {
        user.reload();
        sendEmailVerification(user)
          .then(() => {
            message.success("Verification email sent! :)");
          })
          .catch((error) => {
            message.error(error);
          });
      })
      .catch((error) => {
        message.error(error.message);
      });
  }
  if (newPassword && confirmPassword)
    if (newPassword === confirmPassword) {
      changesFound = true;

      user
        .updatePassword(newPassword)
        .then(() => {
          message.success("Changed password successfully!");
        })
        .catch((error: any) => {
          message.error(error.message);
        });
    } else message.error("Passwords are not the same!");

  if (!changesFound) message.info("No changes!");
};

const whatInformationHasChanged = (
  education: any,
  kids: any,
  partying: any,
  politics: any,
  religion: any,
  userInfo: any
) => {
  let temp: any = {};

  if (userInfo.education !== education && education !== undefined)
    temp.education = education;
  if (userInfo.kids !== kids && kids !== undefined) temp.kids = kids;
  if (userInfo.partying !== partying && partying !== undefined)
    temp.partying = partying;
  if (userInfo.politics !== politics && politics !== undefined)
    temp.politics = politics;
  if (userInfo.religion !== religion && religion !== undefined)
    temp.religion = religion;
  return temp;
};
