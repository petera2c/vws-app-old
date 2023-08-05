const admin = require("firebase-admin");
const moment = require("moment-timezone");
const { createNotification } = require("./notification");
const {
  calculateKarma,
  calculateKarmaUserCanStrip,
  canUpdateTrendingScore,
  createVentLink,
} = require("./util");

const vent_new = require("./email_templates/vent_new");
const vent_like = require("./email_templates/vent_like");

const VENT_LIKE_TRENDING_SCORE_DAY_INCREMENT = 100;
const VENT_LIKE_TRENDING_SCORE_WEEK_INCREMENT = 100;
const VENT_LIKE_TRENDING_SCORE_MONTH_INCREMENT = 100;

const decreaseTrendingScore = async (trendingOption, incrementFunction) => {
  const trendingSnapshot = await admin
    .firestore()
    .collection("/vents/")
    .orderBy(trendingOption, "desc")
    .get();

  for (let index in trendingSnapshot.docs) {
    const trendingVentDoc = trendingSnapshot.docs[index];
    const trendingVentDocData = trendingVentDoc.data();
    const increment = incrementFunction(trendingVentDocData[trendingOption]);

    if (
      trendingVentDocData[trendingOption] > 0 &&
      canUpdateTrendingScore(
        trendingOption,
        trendingVentDocData.server_timestamp
      )
    )
      await admin
        .firestore()
        .collection("vents")
        .doc(trendingVentDoc.id)
        .update({
          [trendingOption]: admin.firestore.FieldValue.increment(-increment),
        });
    else
      await admin
        .firestore()
        .collection("vents")
        .doc(trendingVentDoc.id)
        .update({
          [trendingOption]: admin.firestore.FieldValue.delete(),
        });
  }
};

const newVentListener = async (doc) => {
  const vent = { id: doc.id, ...doc.data() };

  if (vent.new_tags && vent.new_tags.length >= 3) {
    vent.new_tags.splice(3, vent.new_tags.length);

    await admin
      .firestore()
      .collection("vents")
      .doc(vent.id)
      .update({ new_tags: vent.new_tags });
  }

  if (vent && vent.id && vent.server_timestamp && vent.userID) {
    const snapshot = await admin
      .database()
      .ref("followers/" + vent.userID)
      .once("value");

    for (let index in snapshot.val()) {
      await admin
        .database()
        .ref("feed/" + index + "/" + vent.id)
        .set({
          server_timestamp: vent.server_timestamp,
          userID: vent.userID,
        });
    }
  }

  for (let index in vent.new_tags) {
    try {
      await admin
        .firestore()
        .collection("vent_tags")
        .doc(vent.new_tags[index])
        .update({
          uses: admin.firestore.FieldValue.increment(1),
        });
    } catch (e) {
      console.log(e);
    }
  }

  if (vent.is_birthday_post) {
    const userInfoDoc = await admin
      .firestore()
      .collection("users_info")
      .doc(vent.userID)
      .get();

    if (
      !userInfoDoc.data().birth_date ||
      new moment(userInfoDoc.data().birth_date).format("MMDD") !==
        new moment().format("MMDD") ||
      (userInfoDoc.data().last_birthday_post &&
        new moment().diff(
          new moment(userInfoDoc.data().last_birthday_post),
          "days"
        ) < 365)
    ) {
      return await admin.firestore().collection("vents").doc(vent.id).delete();
    } else {
      await admin.firestore().collection("users_info").doc(vent.userID).update({
        last_birthday_post: admin.firestore.Timestamp.now().toMillis(),
      });
    }
  }

  if (vent.server_timestamp > admin.firestore.Timestamp.now().toMillis()) {
    vent.server_timestamp = admin.firestore.Timestamp.now().toMillis();
    await admin
      .firestore()
      .collection("vents")
      .doc(vent.id)
      .set(vent, { merge: true });
  }

  if (vent.userID) {
    const usersBasicInfoDoc = await admin
      .firestore()
      .collection("users_display_name")
      .doc(vent.userID)
      .get();

    await admin
      .firestore()
      .collection("user_rewards")
      .doc(vent.userID)
      .update({
        created_vents_counter: admin.firestore.FieldValue.increment(1),
      });

    let minutesTillNextVent = 300;
    const usersKarma = calculateKarma(usersBasicInfoDoc.data());

    if (usersKarma >= 5000) minutesTillNextVent = 60;
    else if (usersKarma >= 2500) minutesTillNextVent = 60;
    else if (usersKarma >= 1000) minutesTillNextVent = 60;
    else if (usersKarma >= 500) minutesTillNextVent = 60;
    else if (usersKarma >= 250) minutesTillNextVent = 120;
    else if (usersKarma >= 100) minutesTillNextVent = 180;
    else if (usersKarma >= 50) minutesTillNextVent = 240;

    await admin
      .firestore()
      .collection("user_vent_timeout")
      .doc(vent.userID)
      .set({
        value: new moment().add(minutesTillNextVent, "minutes").format(),
      });
  }

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(vent.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_new)
    return createNotification(
      userSettingsDoc.data().mobile_vent_new === true,
      userSettingsDoc.data().email_vent_new === true
        ? {
            html: vent_new,
            subject: "Your new vent is live!",
          }
        : undefined,
      createVentLink(vent),
      "Your new vent is live!",
      vent.userID
    );
};

const newVentLikeListener = async (change, context) => {
  const { ventIDuserID } = context.params;
  const ventIDuserIDArray = ventIDuserID.split("|||");

  const hasLiked = change.after.data() ? change.after.data().liked : false;
  let increment = 1;
  if (!hasLiked) increment = -1;

  if (
    change.after.data() &&
    change.before.data() &&
    change.after.data().liked === change.before.data().liked
  ) {
    return;
  }

  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .get();

  const vent = { id: ventDoc.id, ...ventDoc.data() };

  let tempObject = {
    like_counter: admin.firestore.FieldValue.increment(increment),
  };
  if (
    canUpdateTrendingScore("day", ventDoc.data().server_timestamp) &&
    hasLiked &&
    !change.before.data()
  )
    tempObject.trending_score_day = admin.firestore.FieldValue.increment(
      VENT_LIKE_TRENDING_SCORE_DAY_INCREMENT
    );
  if (
    canUpdateTrendingScore("week", ventDoc.data().server_timestamp) &&
    hasLiked &&
    !change.before.data()
  )
    tempObject.trending_score_week = admin.firestore.FieldValue.increment(
      VENT_LIKE_TRENDING_SCORE_WEEK_INCREMENT
    );
  if (
    canUpdateTrendingScore("month", ventDoc.data().server_timestamp) &&
    hasLiked &&
    !change.before.data()
  )
    tempObject.trending_score_month = admin.firestore.FieldValue.increment(
      VENT_LIKE_TRENDING_SCORE_MONTH_INCREMENT
    );

  await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .update(tempObject);

  if (change.before.data()) return;

  // If user liked their own vent do not notify or give karma
  if (vent.userID == ventIDuserIDArray[1]) return;

  await admin
    .firestore()
    .collection("user_rewards")
    .doc(vent.userID)
    .update({
      received_vent_supports_counter: admin.firestore.FieldValue.increment(1),
    });
  await admin
    .firestore()
    .collection("user_rewards")
    .doc(ventIDuserIDArray[1])
    .update({
      created_vent_supports_counter: admin.firestore.FieldValue.increment(1),
    });

  // Give +4 to the user that received the upvote
  if (vent.userID)
    await admin
      .firestore()
      .collection("users_display_name")
      .doc(vent.userID)
      .set(
        {
          karma: admin.firestore.FieldValue.increment(4),
        },
        { merge: true }
      );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(vent.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_like)
    createNotification(
      userSettingsDoc.data().mobile_vent_like === true,
      userSettingsDoc.data().email_vent_like === true
        ? {
            html: vent_like,
            subject: "Someone has supported your vent! +4 Karma Points",
          }
        : undefined,
      createVentLink(vent),
      "Someone has supported your vent! +4 Karma Points",
      vent.userID
    );
};

const newVentReportListener = async (doc) => {
  const ventID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("vents")
    .doc(ventID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const ventDoc = await admin.firestore().collection("vents").doc(ventID).get();

  const usereBasicInfoDoc = await admin
    .firestore()
    .collection("users_display_name")
    .doc(userID)
    .get();
  const karmaUserCanStrip = calculateKarmaUserCanStrip(
    usereBasicInfoDoc.data()
  );

  await admin
    .firestore()
    .collection("users_display_name")
    .doc(ventDoc.data().userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(-karmaUserCanStrip),
      },
      { merge: true }
    );

  await admin.firestore().collection("admin_notifications").add({
    ventID,
    user_that_reported: userID,
    user_that_got_reported: ventDoc.data().userID,
  });
};

const ventDeleteListener = async (doc) => {
  const ventID = doc.id;

  const commentsOfVentSnapshot = await admin
    .firestore()
    .collection("comments")
    .where("ventID", "==", ventID)
    .get();

  if (commentsOfVentSnapshot.docs) {
    for (let index in commentsOfVentSnapshot.docs) {
      await admin
        .firestore()
        .collection("comments")
        .doc(commentsOfVentSnapshot.docs[index].id)
        .delete();
    }
  }

  const ventLikesSnapshot = await admin
    .firestore()
    .collection("vent_likes")
    .where("ventID", "==", ventID)
    .get();

  if (ventLikesSnapshot.docs)
    for (let index in ventLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("vent_likes")
        .doc(ventLikesSnapshot.docs[index].id)
        .delete();
    }
};

module.exports = {
  decreaseTrendingScore,
  newVentLikeListener,
  newVentListener,
  newVentReportListener,
  ventDeleteListener,
};
