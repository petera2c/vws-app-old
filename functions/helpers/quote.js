const admin = require("firebase-admin");
const moment = require("moment-timezone");

const { calculateKarmaUserCanStrip } = require("./util");
const { createNotification } = require("./notification");

const newQuoteListener = async (doc) => {
  const quote = { id: doc.id, ...doc.data() };

  const todaysFormattedDate = new moment(
    admin.firestore.Timestamp.now().toMillis()
  ).format("MM-DD-YYYY");

  const userQuotesTodaySnapshot = await admin
    .firestore()
    .collection("quotes")
    .where("userID", "==", quote.userID)
    .where("formatted_date", "==", todaysFormattedDate)
    .get();

  if (userQuotesTodaySnapshot.docs && userQuotesTodaySnapshot.docs.length > 0)
    return await admin.firestore().collection("quotes").doc(quote.id).delete();
  else {
    await admin
      .firestore()
      .collection("user_rewards")
      .doc(quote.userID)
      .update({
        created_quotes_counter: admin.firestore.FieldValue.increment(1),
      });

    await admin.firestore().collection("quotes").doc(quote.id).update({
      formatted_date: todaysFormattedDate,
      like_counter: 0,
      server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    });
  }
};

const newQuoteReportListener = async (doc) => {
  const quoteID = doc.id.split("|||")[0];
  const userID = doc.id.split("|||")[1];

  await admin
    .firestore()
    .collection("quotes")
    .doc(quoteID)
    .update({
      report_counter: admin.firestore.FieldValue.increment(1),
    });

  const quoteDoc = await admin
    .firestore()
    .collection("quotes")
    .doc(quoteID)
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
    .doc(quoteDoc.data().userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(-karmaUserCanStrip),
      },
      { merge: true }
    );

  await admin.firestore().collection("admin_notifications").add({
    quoteID,
    user_that_reported: userID,
    user_that_got_reported: quoteDoc.data().userID,
  });
};

const notifyQuoteContestWinner = async () => {
  const yesterdaysFormattedDate = new moment(
    admin.firestore.Timestamp.now().toMillis()
  )
    .utcOffset(0)
    .subtract(1, "days")
    .format("MM-DD-YYYY");

  const quotesSnapshot = await admin
    .firestore()
    .collection("quotes")
    .where("formatted_date", "==", yesterdaysFormattedDate)
    .orderBy("like_counter", "desc")
    .limit(1)
    .get();

  if (
    quotesSnapshot.docs &&
    quotesSnapshot.docs[0] &&
    quotesSnapshot.docs[0].data()
  ) {
    const winnerDoc = {
      id: quotesSnapshot.docs[0].id,
      ...quotesSnapshot.docs[0].data(),
    };

    await admin
      .firestore()
      .collection("users_display_name")
      .doc(winnerDoc.userID)
      .update({
        karma: admin.firestore.FieldValue.increment(50),
      });

    await admin
      .firestore()
      .collection("user_rewards")
      .doc(winnerDoc.userID)
      .update({
        quote_contests_won_counter: admin.firestore.FieldValue.increment(1),
      });

    const userSettingsDoc = await admin
      .firestore()
      .collection("users_settings")
      .doc(winnerDoc.userID)
      .get();

    /*  if (
      userSettingsDoc.data() &&
      userSettingsDoc.data().master_quote_contest_won
    )*/
    createNotification(
      userSettingsDoc.data().mobile_quote_contest_won === true,
      false,
      "/quote-contest",
      "You have won a Quote Contest! +50 Karma Points",
      winnerDoc.userID
    );
  }
};

const quoteDeleteListener = async (doc) => {
  const quoteLikesSnapshot = await admin
    .firestore()
    .collection("quote_likes")
    .where("quoteID", "==", doc.id)
    .get();

  if (quoteLikesSnapshot.docs)
    for (let index in quoteLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("quote_likes")
        .doc(quoteLikesSnapshot.docs[index].id)
        .delete();
    }
};

const quoteLikeListener = async (change, context) => {
  const { quoteIDuserID } = context.params;
  const quoteIDuserIDArray = quoteIDuserID.split("|||");

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
    .collection("quotes")
    .doc(quoteIDuserIDArray[0])
    .update({
      like_counter: admin.firestore.FieldValue.increment(increment),
    });

  if (change.before.data()) return;

  const quoteDoc = await admin
    .firestore()
    .collection("quotes")
    .doc(quoteIDuserIDArray[0])
    .get();

  const quote = { id: quoteDoc.id, ...quoteDoc.data() };

  // If user liked their own quote do not notify or give karma
  if (quote.userID == quoteIDuserIDArray[1]) return;

  await admin
    .firestore()
    .collection("user_rewards")
    .doc(quote.userID)
    .update({
      received_quote_supports_counter: admin.firestore.FieldValue.increment(1),
    });
  await admin
    .firestore()
    .collection("user_rewards")
    .doc(quoteIDuserIDArray[1])
    .update({
      created_quote_supports_counter: admin.firestore.FieldValue.increment(1),
    });

  // Give +2 to the user that received the upvote
  if (quote.userID)
    await admin
      .firestore()
      .collection("users_display_name")
      .doc(quote.userID)
      .set(
        {
          karma: admin.firestore.FieldValue.increment(2),
        },
        { merge: true }
      );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(quote.userID)
    .get();

  if (userSettingsDoc.data() && userSettingsDoc.data().master_quote_like)
    createNotification(
      userSettingsDoc.data().mobile_quote_like === true,
      false,
      "/quote-contest",
      "Someone has supported your quote! +4 Karma Points",
      quote.userID
    );
};

module.exports = {
  newQuoteListener,
  newQuoteReportListener,
  notifyQuoteContestWinner,
  quoteDeleteListener,
  quoteLikeListener,
};
