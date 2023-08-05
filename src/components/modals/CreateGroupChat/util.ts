import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../../config/db_init";

export const saveGroup = async (
  chatNameString,
  existingUsers,
  groupChatEditting,
  navigate,
  userID,
  users
) => {
  const sortedMemberIDs = [
    ...users.map((user) => user.id),
    ...existingUsers.map((user) => user.id),
  ].sort();

  let conversationDoc;

  if (groupChatEditting) {
    await updateDoc(doc(db, "conversations", groupChatEditting.id), {
      chat_name: chatNameString,
      members: sortedMemberIDs,
    });
  } else {
    let tempHasSeenObject = {};
    for (let index in sortedMemberIDs) {
      tempHasSeenObject[sortedMemberIDs[index]] = false;
    }

    conversationDoc = await addDoc(collection(db, "conversations"), {
      chat_name: chatNameString,
      group_owner: userID,
      is_group: true,
      last_updated: Timestamp.now().toMillis(),
      members: sortedMemberIDs,
      server_timestamp: Timestamp.now().toMillis(),
      ...tempHasSeenObject,
    });
  }

  if (!groupChatEditting) navigate("/chat?" + conversationDoc.id);
};
