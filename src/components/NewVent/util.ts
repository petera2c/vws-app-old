import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { db } from "../../config/db_init";

import { message } from "antd";

import { calculateKarma, userSignUpProgress } from "../../util";

dayjs.extend(utc);

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

export const checks = (
  isUserKarmaSufficient,
  setStarterModal,
  user,
  userBasicInfo,
  ventID,
  userVentTimeOut
) => {
  if (userVentTimeOut && !ventID) {
    return () => () => message.info("You need to wait to vent again");
  }

  const userInteractionIssues = userSignUpProgress(user, true);

  if (userInteractionIssues) {
    if (userInteractionIssues === "NSI")
      return () => () => setStarterModal(true);
    else return () => () => userSignUpProgress(user);
  }

  if (!isUserKarmaSufficient) {
    return () => () =>
      message.error(
        "Your karma is currently " +
          calculateKarma(userBasicInfo) +
          ". This indicates you have not been following our rules and are now forbidden to comment or post."
      );
  }

  return false;
};

export const checkVentTitle = (title) => {
  if (title.length > TITLE_LENGTH_MAXIMUM) {
    message.info("Title is too long! :(");
    return false;
  } else if (title.length < TITLE_LENGTH_MINIMUM) {
    message.info("Your title is too short! :(");
    return false;
  } else if (!title.trim()) {
    message.info("Your title needs more than just white space :(");
    return false;
  }

  return true;
};

export const getQuote = async (isMounted, setQuote) => {
  const yesterdaysFormattedDate = new dayjs(Timestamp.now().toMillis())
    .utcOffset(0)
    .subtract(1, "days")
    .format("MM-DD-YYYY");

  const quotesSnapshot = await getDocs(
    query(
      collection(db, "quotes"),
      where("formatted_date", "==", yesterdaysFormattedDate),
      orderBy("like_counter", "desc"),
      limit(1)
    )
  );

  if (
    quotesSnapshot.docs &&
    quotesSnapshot.docs[0] &&
    quotesSnapshot.docs[0].data() &&
    isMounted()
  ) {
    const author = await getDoc(
      doc(db, "users_display_name", quotesSnapshot.docs[0].data().userID)
    );

    const displayName = author.data() ? author.data().displayName : "Anonymous";
    setQuote({
      displayName,
      id: quotesSnapshot.docs[0].id,
      ...quotesSnapshot.docs[0].data(),
    });
  }
};

export const getTags = async (setSearchedVentTags, setVentTags) => {
  const snapshot = await getDocs(query(collection(db, "vent_tags")));

  const tags = [];

  for (let index in snapshot.docs) {
    const temp = snapshot.docs[index];

    tags.push({ ...temp.data(), id: temp.id });
  }

  setSearchedVentTags(tags);
  setVentTags(tags);
};

export const getUserVentTimeOut = async (callback, userID) => {
  const userVentTimeOutDoc = await getDoc(doc(db, "user_vent_timeout", userID));

  let timeOutDate;
  const currentDate = new dayjs();

  if (userVentTimeOutDoc.exists()) {
    timeOutDate = new dayjs(userVentTimeOutDoc.data().value);
  }

  if (timeOutDate && currentDate.diff(timeOutDate) < 0) callback(timeOutDate);
  else callback(false);
};

export const getVent = async (
  isMounted,
  setDescription,
  setTags,
  setTitle,
  ventID
) => {
  const ventDoc = await getDoc(doc(db, "vents", ventID));

  const vent = ventDoc.data();

  if (!isMounted()) return;

  if (vent) {
    setDescription(vent.description);
    setTags(
      vent.new_tags
        ? vent.new_tags.map((tag) => {
            return { objectID: tag };
          })
        : []
    );
    setTitle(vent.title);
  }
};

export const saveVent = async (
  callback,
  isBirthdayPost,
  tags,
  ventObject,
  ventID,
  user
) => {
  if (!ventID) {
    ventObject.server_timestamp = Timestamp.now().toMillis();
    ventObject.comment_counter = 0;
    ventObject.like_counter = 0;
  }
  ventObject.userID = user.uid;
  ventObject.last_updated = Timestamp.now().toMillis();

  let tagIDs = [];
  for (let index in tags) {
    tagIDs.push(tags[index].objectID);
  }

  ventObject.new_tags = tagIDs.sort();

  if (ventObject.new_tags && ventObject.new_tags.length >= 4)
    return message.info("You can not set more than 3 tags in a vent!");

  if (isBirthdayPost) ventObject.is_birthday_post = isBirthdayPost;

  let newVent = ventObject;
  if (ventID) {
    await updateDoc(doc(db, "vents", ventID), ventObject);
  } else newVent = await addDoc(collection(db, "vents"), ventObject);
  callback({ id: newVent.id ? newVent.id : ventID, title: ventObject.title });
};

export const selectEncouragingMessage = () => {
  const nicePlaceholdersArray = [
    "Let it all out. You are not alone.",
    "What is going on in your life?",
    "What are you working through?",
    "We are here for you.",
  ];

  return nicePlaceholdersArray[
    Math.floor(Math.random() * nicePlaceholdersArray.length)
  ];
};

export const updateTags = (setTags, tag) => {
  setTags((oldTags) => {
    if (
      oldTags &&
      oldTags.findIndex((oldTag) => oldTag.objectID === tag.objectID) >= 0
    ) {
      message.info("Tag is already added :)");
      return oldTags;
    } else {
      return [tag, ...oldTags].sort((a, b) => {
        if (a.objectID < b.objectID) return -1;
        else return 1;
      });
    }
  });
};
