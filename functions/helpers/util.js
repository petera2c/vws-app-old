const admin = require("firebase-admin");
const moment = require("moment-timezone");

const calculateKarma = (usereBasicInfo) => {
  return usereBasicInfo.karma ? usereBasicInfo.karma : 0;
};

const calculateKarmaUserCanStrip = () => {
  return 30;
  /*
  if (!usereBasicInfo) return 5;
  if (usereBasicInfo.karma > 1000) return 200;
  else if (usereBasicInfo.karma > 500) return 100;
  else if (usereBasicInfo.karma > 250) return 50;
  else if (usereBasicInfo.karma > 100) return 20;
  else if (usereBasicInfo.karma > 50) return 10;
  else if (usereBasicInfo.karma > 0) return 5;
  */
};

const canUpdateTrendingScore = (option, serverTimestamp) => {
  const days = Math.floor(
    new moment().diff(new moment(serverTimestamp)) / 1000 / 3600 / 24
  );

  if ((option === "day" || option === "trending_score_day") && days >= 1)
    return false;
  else if ((option === "week" || option === "trending_score_week") && days >= 7)
    return false;
  else if (
    (option === "month" || option === "trending_score_month") &&
    days >= 30
  )
    return false;
  else return true;
};

const capitolizeFirstChar = (string) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

const createBirthdayLink = () => {
  return "/birthday-post";
};

const createVentLink = (vent) => {
  return (
    "/vent/" +
    vent.id +
    "/" +
    vent.title
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/ /g, "-")
      .toLowerCase()
  );
};

const getMetaInformation = async (url, callback) => {
  let description = "";
  let keywords = "";
  let title = "";

  let vent;

  const questionMarkID = url.substring(
    url.lastIndexOf("?") + 1,
    url.length - 1
  );
  const slashID = url.substring(url.lastIndexOf("/") + 1, url.length);

  let ventID = url.match(/(?<=\/vent\/\s*).*?(?=\s*\/)/gs);
  if (ventID) ventID = ventID[0];

  if (url.substring(0, 5) === "/vent" && ventID) {
    const ventDoc = await admin
      .firestore()
      .collection("vents")
      .doc(ventID)
      .get();
    vent = ventDoc.data();

    if (vent) {
      description = vent.description ? vent.description.substring(0, 140) : "";
      title = vent.title ? vent.title.substring(0, 60) : "";
      vent = { id: ventDoc.id, ...vent };
    }
  } else if (url.substring(0, 9) === "/profile?" && questionMarkID) {
    const userDoc = await admin
      .firestore()
      .collection("users_display_name")
      .doc(questionMarkID)
      .get();

    if (userDoc && userDoc.data() && userDoc.data().displayName) {
      title =
        capitolizeFirstChar(userDoc.data().displayName) +
        "'s Profile and Recent Activity";
    }
  } else if (url.substring(0, 5) === "/tags" && slashID) {
    const ventTagDoc = await admin
      .firestore()
      .collection("vent_tags")
      .doc(slashID)
      .get();

    if (ventTagDoc.data()) {
      description =
        "Read vents about " +
        ventTagDoc.data().display.toLowerCase() +
        ". Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback.";
      keywords = ventTagDoc.data().display.toLowerCase();
      title = "Vents About " + ventTagDoc.data().display;
    }
  }

  if (url === "/") {
    description =
      "Vent online with strangers. VWS is a site where you can make friends and get help on your specific situation all for free. Our site is 100% anonymous.";
    keywords =
      "muttr,vent online,vent to someone,vent app,I need to vent,anonymous chat,talk to strangers, chat rooms, chat with strangers";
    title = "Vent and Chat Anonymously With Strangers";
  } else if (url === "/my-feed") {
    title = "My Awesome Feed";
  } else if (url === "/game") {
    title = "VWS Game";
  } else if (url === "/account") {
    title = "Account";
  } else if (url === "/avatar") {
    title = "Avatar";
  } else if (url === "/birthday-post") {
    title = "Happy Birthday!";
  } else if (url === "/chat-with-strangers") {
    description =
      "Chat anonymously with great strangers. Our site is free of bullies, bots and perverts. Everything is 100% free and no credit card is required.";
    keywords =
      "vent with someone,anonymously chat,random chat,vent chat,chat rooms,chat with strangers";
    title = "Chat With Strangers";
  } else if (url === "/chat") {
    description = "Your inbox.";
    keywords = "";
    title = "Chat";
  } else if (url === "/make-friends") {
    description =
      "Making friends online has never been easier. After filling out your profile we will match you with like minded people! :)";
    keywords = "make friends online,make friends,make friends app";
    title = "Make Friends";
  } else if (url === "/people-online") {
    description =
      "The help you have been looking for is here. These are people online right now. Start chatting with real and kind people.";
    keywords = "";
    title = "Current People Online On Vent With Strangers";
  } else if (url === "/profile") {
    title = "Profile";
  } else if (url === "/privacy-policy") {
    title = "Privacy Policy";
  } else if (url === "/quote-contest") {
    description =
      "View geel good quotes. We have a daily contest to see who can create the best feel good quote. View past winners and all quotes.";
    keywords = "feel good quotes";
    title = "Feel Good Quotes";
  } else if (url === "/recent") {
    description = "View most recent vents on Vent With Strangers";
    title = "Recent Vents";
  } else if (url === "/feel-good-quotes-month") {
    description =
      "Our favourite quotes from contest winners on Vent With Strangers! We hope these quotes inspire you and make your day just a little bit better :)";
    keywords = "feel good quotes, happy quotes, inspirational quotes";
    title = moment().format("MMMM YYYY") + " Feel Good Quotes";
  } else if (url === "/rewards") {
    description =
      "Earning rewards is lots of fun on Vent With Strangers. View this page to know how far away your milestones are! :)";
    keywords = "";
    title = "Your Rewards";
  } else if (url === "/rules") {
    description =
      "Vent With Strangers is a safe and secure place. Our rules are very easy to follow :) Be nice and you will be totally fine!";
    keywords = "";
    title = "VWS Rules";
  } else if (url === "/search") {
    title = "Search";
  } else if (url === "/settings") {
    title = "Settings";
  } else if (url === "/site-info") {
    description =
      "Our site is awesome. You can, chat with strangers, create anonymous vents, create an avatar and more :) Read about it here!";
    keywords = "vent with strangers, chat anonymously, chat online";
    title = "Vent With Strangers Rules Info";
  } else if (url === "/trending") {
    description = "Daily trending vents on Vent With Strangers";
    title = "Daily Trending Vents";
  } else if (url === "/trending/this-week") {
    description = "Weekly trending vents on Vent With Strangers";
    title = "Weekly Trending Vents";
  } else if (url === "/trending/this-month") {
    description = "Monthly trending vents on Vent With Strangers";
    title = "Monthly Trending Vents";
  } else if (url === "/vent-to-strangers") {
    description =
      "You are not alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you.";
    keywords = "vent to strangers,vent to someone,chat with strangers";
    title = "Vent To Strangers";
  } else if (url.substring(0, 5) === "/tags" && slashID === "tags") {
    description =
      "Read vents on any of our tags. Vent With Strangers is a safe place where people can talk about their problems and receive positive constructive feedback.";
    keywords = "anxiety,bullying,depression,family,school";
    title = "View Vents Based on Anxiety, Bullying, Depression and More";
  }

  return callback(
    {
      description,
      keywords,
      title,
    },
    Boolean(title),
    vent
  );
};

const updateTotalUsersOnline = (change) => {
  const setToDatabase = (state) => {
    if (state === "online") {
      admin
        .database()
        .ref("total_online_users2")
        .set(admin.database.ServerValue.increment(1));
    } else if (state === "offline") {
      admin
        .database()
        .ref("total_online_users2")
        .set(admin.database.ServerValue.increment(-1));
    }
  };

  const changeAfter = change.after;
  const changeBefore = change.before;

  if (!changeAfter.val() && !changeBefore.val()) {
    // Do nothing, should never happen
  } else if (!changeBefore.val()) {
    // New doc
    // console.log("new doc");

    if (changeAfter.val() === "online") setToDatabase(changeAfter.val());
  } else if (!changeAfter.val()) {
    // Doc deleted
    // console.log("doc deleted");

    setToDatabase(changeBefore.val() === "online" ? "offline" : "");
  } else {
    // Doc updated
    // console.log("doc updated");

    if (changeBefore.val() !== changeAfter.val()) {
      // console.log("updated with different values");
      setToDatabase(changeAfter.val());
    }
  }
  return 10;
};

module.exports = {
  calculateKarma,
  calculateKarmaUserCanStrip,
  canUpdateTrendingScore,
  combineObjectWithID,
  createBirthdayLink,
  createVentLink,
  getMetaInformation,
  updateTotalUsersOnline,
};
