const admin = require("firebase-admin");
const moment = require("moment-timezone");
const { createNotification } = require("./notification");
const { createBirthdayLink } = require("./util");

const link_sign_up = require("./email_templates/link_sign_up");

const sgMail = require("@sendgrid/mail");

const { sendGridApiKey } = require("../config/keys");
sgMail.setApiKey(sendGridApiKey);

const checkForBirthdays = async () => {
  console.log("starting birthday checker");
  const usersInfoSnapshot = await admin
    .firestore()
    .collection("users_info")
    .orderBy("birth_date")
    .get();

  for (let index in usersInfoSnapshot.docs) {
    const userInfoDoc = usersInfoSnapshot.docs[index];

    const usersBirthday = new moment(userInfoDoc.data().birth_date);
    const today = new moment();

    if (usersBirthday.format("MMDD") === today.format("MMDD")) {
      createNotification(
        true,
        false,
        createBirthdayLink(),
        "From your friends at VWS, have an amazing Birthday!!! :)",
        userInfoDoc.id
      );
    }
  }
};

const createMilestone = async (reward, title, userID) => {
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(reward),
      },
      { merge: true }
    );

  await admin.firestore().collection("rewards").add({
    karma_gained: reward,
    server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    title,
    userID,
  });
};

const checkIfCanCreateMilestone = async (
  counter,
  size,
  title,
  secondTitle,
  userID
) => {
  let reward;
  let first;
  if (size === "tiny") {
    if (counter === 250) {
      reward = 5000;
    } else if (counter === 100) {
      reward = 2000;
    } else if (counter === 50) {
      reward = 1000;
    } else if (counter === 20) {
      reward = 500;
    } else if (counter === 10) {
      reward = 250;
    } else if (counter === 3) {
      reward = 100;
    } else if (counter === 1) {
      reward = 25;
      first = true;
    }
  } else if (size === "small") {
    if (counter === 500) {
      reward = 2500;
    } else if (counter === 250) {
      reward = 1250;
    } else if (counter === 100) {
      reward = 500;
    } else if (counter === 50) {
      reward = 250;
    } else if (counter === 25) {
      reward = 125;
    } else if (counter === 10) {
      reward = 50;
    } else if (counter === 1) {
      reward = 5;
      first = true;
    }
  } else if (size === "medium") {
    if (counter === 5000) {
      reward = 1000;
    } else if (counter === 2000) {
      reward = 400;
    } else if (counter === 1000) {
      reward = 200;
    } else if (counter === 500) {
      reward = 100;
    } else if (counter === 250) {
      reward = 50;
    } else if (counter === 100) {
      reward = 20;
    } else if (counter === 50) {
      reward = 10;
    } else if (counter === 10) {
      reward = 5;
    }
  }

  if (reward) {
    createMilestone(reward, first ? secondTitle : title(counter), userID);
  }
};

const newUserSetup = async (user) => {
  await admin.firestore().collection("user_rewards").doc(user.uid).set({
    created_comment_supports_counter: 0,
    created_comments_counter: 0,
    created_quote_supports_counter: 0,
    created_quotes_counter: 0,
    created_vent_supports_counter: 0,
    created_vents_counter: 0,
    quote_contests_won_counter: 0,
    received_comment_supports_counter: 0,
    received_quote_supports_counter: 0,
    received_vent_supports_counter: 0,
  });

  await admin
    .database()
    .ref("has_been_sent_checkup_email/" + user.uid)
    .set(false);

  await admin
    .firestore()
    .collection("invite_uid")
    .add({ primary_uid: user.uid });
};

const sendCheckUpEmail = (nextPageToken) => {
  let counter = 0;

  admin
    .auth()
    .listUsers(50, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(async (userRecord) => {
        const days = Math.floor(
          new moment().diff(new moment(userRecord.metadata.lastSignInTime)) /
            1000 /
            3600 /
            24
        );

        const hasBeenSentCheckupEmail = await admin
          .database()
          .ref("has_been_sent_checkup_email/" + userRecord.uid)
          .once("value");

        if (days > 30 && !hasBeenSentCheckupEmail.val()) {
          const msg = {
            from: "ventwithstrangers@gmail.com",
            subject: "Hello :)",
            text:
              "Hi there, My name is Peter and I am the cofounder of Vent With Strangers. I am trying to make the app the best that it can be. Could you let me know why you stopped using it? Feel free to respond directly to this email :)",
            to: userRecord.email,
          };
          await sgMail
            .send(msg)
            .then(async () => {
              counter++;
              await admin
                .database()
                .ref("has_been_sent_checkup_email/" + userRecord.uid)
                .set(true);
            })
            .catch(({ response }) => {
              console.log(response.body.errors);
            });
        } else {
          console.log("not sending");
        }
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        if (counter < 100) sendCheckUpEmail(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log("Error listing users:", error);
    });
};

const signPeopleOut = () => {
  admin
    .database()
    .ref("total_online_users2")
    .once("value", (doc) => {
      const totalOnlineUser = doc.val();
      if (totalOnlineUser)
        admin
          .database()
          .ref("status")
          .limitToLast(totalOnlineUser)
          .orderByChild("state")
          .once("value", (snapshot) => {
            //let numberOfUsersOnline = 0;

            snapshot.forEach((data) => {
              //if (data.val().status === "online") numberOfUsersOnline++;

              const hoursInactive = Math.floor(
                new moment().diff(new moment(data.val().last_online)) /
                  1000 /
                  3600
              );

              if (!data.val().index && data.val().state === "online") {
                admin
                  .database()
                  .ref("status/" + data.key)
                  .update({
                    index: admin.database.ServerValue.TIMESTAMP,
                  });
              }
              if (!data.val().last_online) {
                admin
                  .database()
                  .ref("status/" + data.key)
                  .update({
                    last_online: admin.database.ServerValue.TIMESTAMP,
                  });
              }

              if (hoursInactive >= 8) {
                admin
                  .database()
                  .ref("status/" + data.key)
                  .set({
                    last_online: admin.database.ServerValue.TIMESTAMP,
                    state: "offline",
                  });
              }
            });
          });
    });
};

const userDelete = async (user) => {
  let counter = 0;
  const batch = admin.firestore().batch();

  const chatQueueSnapshot = await admin
    .firestore()
    .collection("chat_queue")
    .where("userID", "==", user.uid)
    .get();
  for (let index in chatQueueSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("chat_queue")
      .doc(chatQueueSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const conversationsQuerySnapshot = await admin
    .firestore()
    .collection("conversations")
    .where("members", "array-contains", user.uid)
    .get();
  for (let index in conversationsQuerySnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("conversations")
      .doc(conversationsQuerySnapshot.docs[index].id);
    batch.set(
      ref,
      {
        members: admin.firestore.FieldValue.arrayRemove(user.uid),
        [user.uid]: admin.firestore.FieldValue.delete(),
        isTyping: admin.firestore.FieldValue.delete(),
      },
      { merge: true }
    );
  }

  const commentLikesSnapshot = await admin
    .firestore()
    .collection("comment_likes")
    .where("userID", "==", user.uid)
    .get();

  for (let index in commentLikesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("comment_likes")
      .doc(commentLikesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const quoteLikesSnapshot = await admin
    .firestore()
    .collection("quote_likes")
    .where("userID", "==", user.uid)
    .get();
  for (let index in quoteLikesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("quote_likes")
      .doc(quoteLikesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const ventLikesSnapshot = await admin
    .firestore()
    .collection("vent_likes")
    .where("userID", "==", user.uid)
    .get();
  for (let index in ventLikesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("vent_likes")
      .doc(ventLikesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const commentReportsSnapshot = await admin
    .firestore()
    .collection("comment_reports")
    .where("userID", "==", user.uid)
    .get();
  for (let index in commentReportsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("comment_reports")
      .doc(commentReportsSnapshot.docs[index].id);

    batch.delete(ref);
  }

  const quoteReportsSnapshot = await admin
    .firestore()
    .collection("quote_reports")
    .where("userID", "==", user.uid)
    .get();
  for (let index in quoteReportsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("quote_reports")
      .doc(quoteReportsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const ventReportsSnapshot = await admin
    .firestore()
    .collection("vent_reports")
    .where("userID", "==", user.uid)
    .get();
  for (let index in ventReportsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("vent_reports")
      .doc(ventReportsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const commentsSnapshot = await admin
    .firestore()
    .collection("comments")
    .where("userID", "==", user.uid)
    .get();
  for (let index in commentsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("comments")
      .doc(commentsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const quotesSnapshot = await admin
    .firestore()
    .collection("quotes")
    .where("userID", "==", user.uid)
    .get();
  for (let index in quotesSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("quotes")
      .doc(quotesSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const ventsSnapshot = await admin
    .firestore()
    .collection("vents")
    .where("userID", "==", user.uid)
    .get();
  for (let index in ventsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("vents")
      .doc(ventsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const inviteUIDSnapshot = await admin
    .firestore()
    .collection("invite_uid")
    .where("primary_uid", "==", user.uid)
    .get();
  if (inviteUIDSnapshot.doc && inviteUIDSnapshot.docs[0]) {
    const invitedUsersSnapshot = await admin
      .firestore()
      .collection("invited_users")
      .where("referral_secondary_uid", "==", inviteUIDSnapshot.docs[0].id)
      .get();
    for (let index in invitedUsersSnapshot.docs) {
      counter++;
      if (counter === 500) await batch.commit();
      const ref = admin
        .firestore()
        .collection("invited_users")
        .doc(invitedUsersSnapshot.docs[index].id);
      batch.update(ref, { referral_secondary_uid: "deleted" });
    }
  }
  for (let index in inviteUIDSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("invite_uid")
      .doc(inviteUIDSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const notificationsSnapshot = await admin
    .firestore()
    .collection("notifications")
    .where("userID", "==", user.uid)
    .get();
  for (let index in notificationsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("notifications")
      .doc(notificationsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  const rewardsSnapshot = await admin
    .firestore()
    .collection("rewards")
    .where("userID", "==", user.uid)
    .get();
  for (let index in rewardsSnapshot.docs) {
    counter++;
    if (counter === 500) await batch.commit();
    const ref = admin
      .firestore()
      .collection("rewards")
      .doc(rewardsSnapshot.docs[index].id);
    batch.delete(ref);
  }

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(
    admin.firestore().collection("unread_conversations_count").doc(user.uid)
  );

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("user_expo_tokens").doc(user.uid));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("user_matches").doc(user.uid));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(
    admin.firestore().collection("user_mobile_app_rating").doc(user.uid)
  );

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("user_rewards").doc(user.uid));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("user_vent_timeout").doc(user.uid));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(
    admin.firestore().collection("users_display_name").doc(user.uid)
  );

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("users_info").doc(user.uid));

  counter++;
  if (counter === 500) await batch.commit();
  batch.delete(admin.firestore().collection("users_settings").doc(user.uid));

  batch.commit();

  await admin
    .database()
    .ref("status/" + user.uid)
    .remove();

  await admin
    .database()
    .ref("block_check_new/" + user.uid)
    .remove();
};

const userRewardsListener = async (change, context) => {
  const { userID } = context.params;
  const afterUserRewards = { id: change.after.id, ...change.after.data() };
  const beforeUserRewards = { id: change.before.id, ...change.before.data() };

  if (afterUserRewards && beforeUserRewards) {
    if (
      afterUserRewards.quote_contests_won_counter !==
      beforeUserRewards.quote_contests_won_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.quote_contests_won_counter,
        "tiny",
        (number) => "You have won " + number + " quote contests!",
        "You have won your first quote contest! You are amazing!!!",
        userID
      );
    if (
      afterUserRewards.created_comment_supports_counter !==
      beforeUserRewards.created_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comment_supports_counter,
        "medium",
        (number) => "You have supported " + number + " comments!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_comments_counter !==
      beforeUserRewards.created_comments_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comments_counter,
        "small",
        (number) => "You have created " + number + " comments!",
        "You have created your first comment!!!",
        userID
      );
    if (
      afterUserRewards.created_vent_supports_counter !==
      beforeUserRewards.created_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vent_supports_counter,
        "medium",
        (number) => "You have supported " + number + " vents!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_vents_counter !==
      beforeUserRewards.created_vents_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vents_counter,
        "small",
        (number) => "You have created " + number + " vents!",
        "You have created your first vent!!!",
        userID
      );
    if (
      afterUserRewards.received_comment_supports_counter !==
      beforeUserRewards.received_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_comment_supports_counter,
        "medium",
        (number) => "Your comments have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.received_vent_supports_counter !==
      beforeUserRewards.received_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_vent_supports_counter,
        "medium",
        (number) => "Your vents have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_quotes_counter !==
      beforeUserRewards.created_quotes_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_quotes_counter,
        "small",
        (number) => "You have created " + number + " quotes!",
        "You have created your first quote!",
        userID
      );

    if (
      afterUserRewards.received_quote_supports_counter !==
      beforeUserRewards.received_quote_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_quote_supports_counter,
        "medium",
        (number) => "Your quotes have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_quote_supports_counter !==
      beforeUserRewards.created_quote_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_quote_supports_counter,
        "medium",
        (number) => "You have supported " + number + " quotes!",
        undefined,
        userID
      );
  }
};

const userWasInvited = async (doc) => {
  // Check we have all information that we need
  if (!doc.exists) return;

  let userIDThatGotInvited = doc.id;

  if (!userIDThatGotInvited) return;
  if (!doc.data() || !doc.data().referral_secondary_uid) return;

  const getPrimaryuidDoc = await admin
    .firestore()
    .collection("invite_uid")
    .doc(doc.data().referral_secondary_uid)
    .get();

  let userIDThatInvited;
  if (getPrimaryuidDoc.data() && getPrimaryuidDoc.data().primary_uid)
    userIDThatInvited = getPrimaryuidDoc.data().primary_uid;

  if (!userIDThatInvited) return;

  // We now have both primary uids

  // Give user karma
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userIDThatInvited)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(50),
      },
      { merge: true }
    );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(userIDThatInvited)
    .get();

  // Make notification
  if (userSettingsDoc.data() && userSettingsDoc.data().master_link_sign_up)
    createNotification(
      userSettingsDoc.data().mobile_link_sign_up === true,
      userSettingsDoc.data().email_link_sign_up === true
        ? {
            html: link_sign_up,
            subject: "Someone signed up from your link! +100 Karma",
          }
        : undefined,
      "",
      "Someone signed up from your link! +100 Karma",
      userIDThatInvited
    );
  return;
};

module.exports = {
  checkForBirthdays,
  newUserSetup,
  sendCheckUpEmail,
  signPeopleOut,
  userDelete,
  userRewardsListener,
  userWasInvited,
};
