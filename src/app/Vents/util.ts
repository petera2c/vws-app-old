import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import {
  endAt,
  get,
  limitToLast,
  orderByChild,
  query as query2,
  ref,
} from "firebase/database";
import { db, db2 } from "../../config/db_init";
import { getEndAtValueTimestamp } from "../../util";

export const getVents = async (
  isMounted,
  setCanLoadMore,
  setVents,
  user,
  vents,
  whatPage
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
    let newVents = snapshot.docs.map((doc) => ({
      doc,
      id: doc.id,
      ...doc.data(),
    }));

    if (newVents.length < 9) setCanLoadMore(false);
    if (vents) {
      return setVents((oldVents) => {
        if (oldVents) return [...oldVents, ...newVents];
        else return newVents;
      });
    } else {
      return setVents(newVents);
    }
  } else if (snapshotRTDB && snapshotRTDB.val()) {
    let newVents = [];

    snapshotRTDB.forEach((data) => {
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
        return setVents((oldVents) => {
          if (oldVents) return [...oldVents, ...newVents];
          else return newVents;
        });
      } else {
        return setVents(newVents);
      }
    }
  } else return setCanLoadMore(false);
};

export const getWhatPage = (pathname) => {
  if (pathname === "/") return "recent";
  else if (pathname === "/my-feed") return "my-feed";
  else if (pathname === "/recent") return "recent";
  else if (pathname === "/trending") return "trending";
  else if (pathname === "/trending/this-week") return "trending-week";
  else if (pathname === "/trending/this-month") return "trending-month";

  return "";
};

export const newVentListener = (
  isMounted,
  setWaitingVents,
  whatPage,
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
            setWaitingVents((vents) => [
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

export const getMeta = (metaName) => {
  const metas = document.getElementsByTagName("meta");

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") === metaName) {
      return metas[i].getAttribute("content");
    }
  }

  return "";
};
