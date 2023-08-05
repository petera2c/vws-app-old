const admin = require("firebase-admin");

const blockUserListener = async (change) => {
  const blockBefore = change.before.data();
  const blockAfter = change.after.data();

  if (!blockAfter) {
    // do nothing, because it was deleted
  } else if (!blockBefore) {
    // was just created

    const userID1 = change.after.id.split("|||")[0];
    const userID2 = change.after.id.split("|||")[1];
    const sortedMemberIDs = [userID1, userID2].sort();

    const allConversations = await admin
      .firestore()
      .collection("conversations")
      .where("members", "==", sortedMemberIDs)
      .get();

    for (let userID in blockAfter) {
      if (!blockAfter[userID]) continue;
      else {
        for (let index in allConversations.docs) {
          await admin
            .firestore()
            .collection("conversations")
            .doc(allConversations.docs[index].id)
            .update({
              members: admin.firestore.FieldValue.arrayRemove(userID),
            });
        }
      }
    }
  } else if (blockAfter && blockBefore) {
    // was updated
  } else {
    // no idea what is going on
  }
};

module.exports = {
  blockUserListener,
};
