const admin = require("firebase-admin");
const { sendMobilePushNotifications } = require("./notification");

const messagesListener = async (messageDoc, context) => {
  const { conversationID } = context.params;

  if (messageDoc.data().is_notice) return;

  const conversationDoc = await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .get();

  if (!conversationDoc || !conversationDoc.data()) {
    return "";
  }

  let conversation = conversationDoc.data();
  for (let index in conversation.members) {
    if (messageDoc.data().userID !== conversation.members[index]) {
      const isMutedSnapshot = await admin
        .database()
        .ref("muted/" + conversationDoc.id + "/" + conversation.members[index])
        .once("value");

      if (isMutedSnapshot.val()) continue;

      conversation[conversation.members[index]] = false;
      await admin
        .firestore()
        .collection("unread_conversations_count")
        .doc(conversation.members[index])
        .set({ count: admin.firestore.FieldValue.increment(1) });
      admin
        .database()
        .ref("status/" + conversation.members[index])
        .once("value", (doc) => {
          if (!doc.val() || (doc.val() && doc.val().state !== "online"))
            sendMobilePushNotifications(
              "You have a new message!",
              conversation.members[index]
            );
        });
    }
  }

  conversation.last_updated = admin.firestore.Timestamp.now().toMillis();
  conversation.last_message = messageDoc.data().body;

  await admin
    .firestore()
    .collection("conversations")
    .doc(conversationID)
    .set(conversation);
};

module.exports = { messagesListener };
