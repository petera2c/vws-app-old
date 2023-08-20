import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { db } from "../../config/db_init";

export const calculateMilestone = (counter: number, size: string) => {
  if (size === "tiny") {
    if (counter >= 250) return 10000;
    else if (counter >= 100) return 5000;
    else if (counter >= 50) return 2000;
    else if (counter >= 20) return 1000;
    else if (counter >= 10) return 500;
    else if (counter >= 3) return 250;
    else if (counter >= 1) return 100;
    else if (counter >= 0) return 25;
  } else if (size === "small") {
    if (counter >= 500) return 5000;
    else if (counter >= 250) return 2500;
    else if (counter >= 100) return 1250;
    else if (counter >= 50) return 500;
    else if (counter >= 25) return 250;
    else if (counter >= 10) return 125;
    else if (counter >= 1) return 50;
    else if (counter >= 0) return 5;
  } else if (size === "medium") {
    if (counter >= 5000) return 2500;
    else if (counter >= 2000) return 1000;
    else if (counter >= 1000) return 400;
    else if (counter >= 500) return 200;
    else if (counter >= 250) return 100;
    else if (counter >= 100) return 50;
    else if (counter >= 50) return 20;
    else if (counter >= 10) return 10;
    else if (counter >= 0) return 5;
  }
};
export const getNextMilestone = (counter: number, size: string) => {
  if (size === "tiny") {
    if (counter >= 250) return 500;
    else if (counter >= 100) return 250;
    else if (counter >= 50) return 100;
    else if (counter >= 20) return 50;
    else if (counter >= 10) return 20;
    else if (counter >= 3) return 10;
    else if (counter >= 1) return 3;
    else if (counter >= 0) return 1;
  } else if (size === "small") {
    if (counter >= 500) return 1000;
    else if (counter >= 250) return 500;
    else if (counter >= 100) return 250;
    else if (counter >= 50) return 100;
    else if (counter >= 25) return 50;
    else if (counter >= 10) return 25;
    else if (counter >= 1) return 10;
    else if (counter >= 0) return 1;
  } else if (size === "medium") {
    if (counter >= 5000) return 10000;
    else if (counter >= 2000) return 5000;
    else if (counter >= 1000) return 2000;
    else if (counter >= 500) return 1000;
    else if (counter >= 250) return 500;
    else if (counter >= 100) return 250;
    else if (counter >= 50) return 100;
    else if (counter >= 10) return 50;
    else if (counter >= 0) return 10;
  }
  return 1;
};

export const getUserRecentRewards = async (
  setRecentRewards: any,
  userID: string
) => {
  const recentRewardsSnapshot = await getDocs(
    query(
      collection(db, "rewards"),
      where("userID", "==", userID),
      orderBy("server_timestamp", "desc"),
      limit(5)
    )
  );

  let recentRewards = [];
  if (recentRewardsSnapshot.docs)
    for (let index in recentRewardsSnapshot.docs) {
      const rewardDoc = recentRewardsSnapshot.docs[index];
      recentRewards.push({
        id: rewardDoc.id,
        ...rewardDoc.data(),
        doc: rewardDoc,
      });
    }
  setRecentRewards(recentRewards);
};

export const getUserRewardsProgress = async (
  setUserRewards: any,
  userID: string
) => {
  const userRewardsDoc = await getDoc(doc(db, "user_rewards", userID));

  if (userRewardsDoc.exists() && userRewardsDoc.data())
    setUserRewards(userRewardsDoc.data());
};
