import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../../config/db_init";

export const createShareLink = (secondUID) => {
  let link = "https://www.ventwithstrangers.com?referral=" + secondUID;
  if (process.env.NODE_ENV === "development")
    link = "http://localhost:3000?referral=" + secondUID;

  return link;
};

export const getSecondUID = async (setSecondUID, uid) => {
  const snapshot = await getDocs(
    query(collection(db, "invite_uid"), where("primary_uid", "==", uid))
  );

  if (snapshot.docs && snapshot.docs.length > 0) {
    const doc = snapshot.docs[0];
    setSecondUID(doc.id);
  }
};
