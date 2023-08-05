import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "@firebase/firestore";

import { db } from "@/config/db_init";
import { getEndAtValueTimestamp } from "@/util";
import Tag from "@/types/Tag";

export const getTags = async (setTags: any, tags?: Tag[]) => {
  let startAt = getEndAtValueTimestamp(tags);

  const tagsSnapshot = await getDocs(
    query(
      collection(db, "vent_tags"),
      orderBy("display"),
      startAfter(startAt),
      limit(20)
    )
  );

  let newTags: any[] = [];

  for (let index in tagsSnapshot.docs) {
    newTags.push({
      id: tagsSnapshot.docs[index].id,
      doc: tagsSnapshot.docs[index],
      ...tagsSnapshot.docs[index].data(),
    });
  }

  if (tags)
    return setTags((oldTags: any) => {
      if (oldTags) return [...oldTags, ...newTags];
      else return newTags;
    });
  else return setTags(newTags);
};
