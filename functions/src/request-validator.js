const qs = require("qs");
const crypto = require("crypto");
const functions = require("firebase-functions");
let hmac;

const getSignature = req => {
  const slackSigningSecret = functions.config().slack.signingsecret;
  hmac = crypto.createHmac("sha256", slackSigningSecret);
  const timestamp = req.headers["x-slack-request-timestamp"];
  const sig_basestring =
    "v0:" + timestamp + ":" + qs.stringify(req.body, { format: "RFC1738" });
  hmac.update(sig_basestring);
  const my_signature = "v0=" + hmac.digest("hex");
  console.log("my_signature", my_signature);

  return Buffer.from(my_signature);
};

const validator = req => {
  const slack_signature = Buffer.from(req.headers["x-slack-signature"]);
  console.log("slack_signature", req.headers["x-slack-signature"]);

  const my_signature = getSignature(req);
  return crypto.timingSafeEqual(slack_signature, my_signature);
};

module.exports = validator;
