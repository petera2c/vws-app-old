import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "@firebase/firestore";

import { db } from "../../config/db_init";

import { getEndAtValueTimestamp } from "../../util";
import Vent from "@/types/Vent";

export const getTagVents = async (
  isMounted: any,
  setCanLoadMoreVents: any,
  setVents: any,
  tagID: string,
  vents: Vent[]
) => {
  let startAt = getEndAtValueTimestamp(vents);

  const ventsSnapshot = await getDocs(
    query(
      collection(db, "vents"),
      where("new_tags", "array-contains", tagID),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (!isMounted()) return;

  let newVents: any[] = [];

  for (let index in ventsSnapshot.docs) {
    newVents.push({
      id: ventsSnapshot.docs[index].id,
      doc: ventsSnapshot.docs[index],
      ...ventsSnapshot.docs[index].data(),
    });
  }

  if (newVents.length < 10) {
    setCanLoadMoreVents(false);
  }

  if (vents)
    return setVents((oldVents: Vent[]) => {
      if (oldVents) return [...oldVents, ...newVents];
      else return newVents;
    });
  else return setVents(newVents);
};
