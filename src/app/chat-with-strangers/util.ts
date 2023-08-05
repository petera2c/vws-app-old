import { doc, setDoc, Timestamp } from "@firebase/firestore";
import { db } from "../../config/db_init";

export const joinQueue = async (userID: string) => {
  await setDoc(doc(db, "chat_queue", userID), {
    server_timestamp: Timestamp.now().toMillis(),
    userID,
  });
};
