const admin = require("firebase-admin");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

const { sendGridApiKey } = require("../config/keys");
sgMail.setApiKey(sendGridApiKey);

const createNotification = async (
  canPushMobileNotification,
  emailNotificationInformation,
  link,
  message,
  userID
) => {
  if (!userID) return;

  await admin.firestore().collection("notifications").add({
    hasSeen: false,
    link,
    message,
    server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    userID,
  });

  /*
  if (
    emailNotificationInformation &&
    process.env.FUNCTIONS_EMULATOR !== "true"
  ) {

    admin
      .auth()
      .getUser(userID)
      .then((user) => {
        if (user.email) {
          const { html, subject } = emailNotificationInformation;

          const msg = {
            to: user.email,
            from: "ventwithstrangers@gmail.com",
            subject,
            html,
          };
          sgMail
            .send(msg)
            .then(() => {
              console.log("Email sent");
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  }*/

  if (canPushMobileNotification)
    admin
      .database()
      .ref("status/" + userID)
      .once("value", (doc) => {
        if (doc.val().state !== "online")
          sendMobilePushNotifications(message, userID);
      });
};

const sendMobilePushNotifications = async (message, userID) => {
  let userExpoTokensDoc = await admin
    .firestore()
    .collection("user_expo_tokens")
    .doc(userID)
    .get();

  if (userExpoTokensDoc.data())
    for (let index in userExpoTokensDoc.data().tokens) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userExpoTokensDoc.data().tokens[index],
          sound: "default",
          title: "Vent With Strangers",
          body: message,
        }),
      });
    }
};

module.exports = { createNotification, sendMobilePushNotifications };
