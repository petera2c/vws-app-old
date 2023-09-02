const functions = require("firebase-functions");

module.exports = {
  amazonAccessKeyID: functions.config().secret.amazon_access_key_id,
  amazonSecretAccessKey: functions.config().secret.amazon_secret_access_key,
  amazonBucket: functions.config().secret.amazon_bucket,
  sendGridApiKey: functions.config().secret.sendgrid_api_key,
};

// firebase functions:config:set secret.sendgrid_api_key="THE API KEY"
// functions.config().secret.API_KEY
