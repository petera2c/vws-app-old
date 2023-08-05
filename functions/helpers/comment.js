const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const {
  calculateKarmaUserCanStrip,
  canUpdateTrendingScore,
  createVentLink,
} = require("./util");

const comment_like = require("./email_templates/comment_like");
const comment_on_vent = require("./email_templates/comment_on_vent");
const comment_tagged = require("./email_templates/comment_tagged");

const COMMENT_TRENDING_SCORE_DAY_INCREMENT = 10;
const COMMENT_TRENDING_SCORE_WEEK_INCREMENT = 10;
const COMMENT_TRENDING_SCORE_MONTH_INCREMENT = 10;

const commentDeleteListener = async (doc) => {
  const commentID = doc.id;

  const commentLikesSnapshot = await admin
    .firestore()
    .collection("comment_likes")
    .where("commentID", "==", commentID)
    .get();

  if (commentLikesSnapshot.docs)
    for (let index in commentLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("comment_likes")
        .doc(commentLikesSnapshot.docs[index].id)
        .delete();
    }

  admin
    .firestore()
    .collection("vents")
    .doc(doc.data().ventID)
    .update({
      comment_counter: admin.firestore.FieldValue.increment(-1),
    });
};

const commentLikeListener = async (change, context) => {
  const { commentIDUserID } = context.params;
  const commentIDuserIDArray = commentIDUserID.split("|||");

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

  await admin
    .firestore()
    .collection("comments")
    .doc(commentIDuserIDArray[0])
    .update({
      like_counter: admin.firestore.FieldValue.increment(increment),
    });

  if (change.before.data()) return;

  const commentDoc = await admin
    .firestore()
    .collection("comments")
    .doc(commentIDuserIDArray[0])
    .get();

  const comment = commentDoc.data();

  // If user liked their own comment do not notify or give karma
  if (comment.userID == commentIDuserIDArray[1]) return;

  await admin
    .firestore()
    .collection("user_rewards")
    .doc(comment.userID)
    .update({
      received_comment_supports_counter: admin.firestore.FieldValue.increment(
        1
      ),
    });
  await admin
    .firestore()
    .collection("user_rewards")
    .doc(commentIDuserIDArray[1])
    .update({
      created_comment_supports_counter: admin.firestore.FieldValue.increment(1),
    });

  // Give +4 to the user that made the comment
  if (comment.userID)
    await admin
      .firestore()
      .collection("users_display_name")
      .doc(comment.userID)
      .set(
        {
          karma: admin.firestore.FieldValue.increment(4),
        },
        { merge: true }
      );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(comment.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_comment_like) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(comment.ventID)
      .get();

    if (ventDoc.exists)
      createNotification(
        userSettingsDoc.data().mobile_comment_like === true,
        userSettingsDoc.data().email_comment_like === true
          ? {
              html: comment_like,
              subject: "Someone has supported your comment! +4 Karma Points",
            }
          : undefined,
        createVentLink({ id: ventDoc.id, ...ventDoc.data() }),
        "Someone has supported your comment! +4 Karma Points",
        comment.userID
      );
  }
};

const createNewCommentNotification = async (doc) => {
  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(doc.data().ventID)
    .get();

  if (!ventDoc.exists) return "Cannot find post.";

  const vent = { id: ventDoc.id, ...ventDoc.data() };

  if (vent.userID == doc.data().userID) return;

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(vent.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_vent_commented) {
    return createNotification(
      userSettingsDoc.data().mobile_vent_commented === true,
      userSettingsDoc.data().email_vent_commented === true
        ? {
            html: comment_on_vent,
            subject: "Your vent has a new comment!",
          }
        : undefined,
      createVentLink(vent),
      "Your vent has a new comment!",
      vent.userID
    );
  }
};

const createNotificationsToAnyTaggedUsers = async (doc) => {
  const commentText = doc.data().text;

  if (!commentText) return;
  const regexFull = /@\[[\x21-\x5A|\x61-\x7A|\x5f]+\]\([\x21-\x5A|\x61-\x7A]+\)/gi;
  const regexFindID = /\([\x21-\x5A|\x61-\x7A]+\)/gi;

  let listOfTaggedIDs = [];

  commentText.replace(regexFull, (possibleTag) => {
    const displayNameArray = possibleTag.match(regexFindID);

    if (displayNameArray && displayNameArray[0]) {
      let displayTag = displayNameArray[0];

      if (displayTag) displayTag = displayTag.slice(1, displayTag.length - 1);

      listOfTaggedIDs.push(displayTag);
      return displayNameArray[0];
    } else return possibleTag;
  });

  if (listOfTaggedIDs && listOfTaggedIDs.length > 0) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(doc.data().ventID)
      .get();

    if (!ventDoc.exists) return "Cannot find post.";

    const vent = { id: ventDoc.id, ...ventDoc.data() };

    for (let index in listOfTaggedIDs) {
      const userSettingsDoc = await admin
        .firestore()
        .collection("users_settings")
        .doc(listOfTaggedIDs[index])
        .get();

      if (
        userSettingsDoc.data() &&
        userSettingsDoc.data().master_comment_tagged
      ) {
        createNotification(
          userSettingsDoc.data().mobile_comment_tagged === true,
          userSettingsDoc.data().email_comment_tagged === true
            ? {
                html: comment_tagged,
                subject: "You have been tagged in a comment!",
              }
            : undefined,
          createVentLink(vent),
          "You have been tagged in a comment!",
          listOfTaggedIDs[index]
        );
      }
    }
  }
};

const newCommentListener = async (doc, context) => {
  createNotificationsToAnyTaggedUsers(doc, context);
  createNewCommentNotification(doc, context);

  let comment = { ...doc.data() };

  await admin
    .firestore()
    .collection("user_rewards")
    .doc(comment.userID)
    .update({
      created_comments_counter: admin.firestore.FieldValue.increment(1),
    });

  // Make sure comment timestamp is ok
  if (comment.server_timestamp > admin.firestore.Timestamp.now().toMillis()) {
    comment.server_timestamp = admin.firestore.Timestamp.now().toMillis();
    await admin
      .firestore()
      .collection("comments")
      .doc(doc.id)
      .set(comment, { merge: true });
  }

  if (doc.data() && doc.data().ventID) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(doc.data().ventID)
      .get();

    if (ventDoc.data() && ventDoc.data().server_timestamp) {
      let tempObject = {
        comment_counter: admin.firestore.FieldValue.increment(1),
      };
      if (canUpdateTrendingScore("day", ventDoc.data().server_timestamp))
        tempObject.trending_score_day = admin.firestore.FieldValue.increment(
          COMMENT_TRENDING_SCORE_DAY_INCREMENT
        );
      if (canUpdateTrendingScore("week", ventDoc.data().server_timestamp))
        tempObject.trending_score_week = admin.firestore.FieldValue.increment(
          COMMENT_TRENDING_SCORE_WEEK_INCREMENT
        );
      if (canUpdateTrendingScore("month", ventDoc.data().server_timestamp))
        tempObject.trending_score_month = admin.firestore.FieldValue.increment(
          COMMENT_TRENDING_SCORE_MONTH_INCREMENT
        );

      await admin
        .firestore()
        .collection("vents")
        .doc(doc.data().ventID)
        .update(tempObject);
    }
  }
};

const newCommentReportListener = async (doc) => {
  const commentID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("comments")
    .doc(commentID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const commentDoc = await admin
    .firestore()
    .collection("comments")
    .doc(commentID)
    .get();

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
    .doc(commentDoc.data().userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(-karmaUserCanStrip),
      },
      { merge: true }
    );

  await admin.firestore().collection("admin_notifications").add({
    commentID,
    user_that_reported: userID,
    user_that_got_reported: commentDoc.data().userID,
    ventID: doc.data().ventID,
  });
};

module.exports = {
  newCommentListener,
  commentDeleteListener,
  commentLikeListener,
  newCommentReportListener,
};
