import {
  getDocs,
  collection,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../config/db_init";
import dayjs from "dayjs";

export const getQuotes = async (isMounted: any, setQuotes: any) => {
  const snapshot = await getDocs(
    query(
      collection(db, "quotes"),
      where("is_featured", "==", true),
      where("server_timestamp", ">", dayjs().subtract(30, "day").valueOf()),
      orderBy("server_timestamp", "desc")
    )
  );

  if (isMounted())
    setQuotes(
      snapshot.docs.map((doc) => {
        return { id: doc.id, doc, ...doc.data() };
      })
    );
};
