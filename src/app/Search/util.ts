"use client";
import { collection, getDocs, limit, query, where } from "@firebase/firestore";
import { db } from "../../config/db_init";

export const searchVents = async (search: string, setVents: any) => {
  const snapshot = await getDocs(
    query(
      collection(db, "vents"),
      where("title", ">=", search),
      where("title", "<=", search + "\uf8ff"),
      limit(10)
    )
  );
  let vents;

  if (snapshot && snapshot.docs && snapshot.docs.length > 0)
    vents = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

  setVents(vents);
};
