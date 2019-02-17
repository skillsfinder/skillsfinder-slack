const querystring = require("querystring");
const crypto = require("crypto");
let hmac;

const getSignature = req => {
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
  hmac = crypto.createHmac("sha256", slackSigningSecret);
  const timestamp = req.headers["X-Slack-Request-Timestamp"];
  const sig_basestring =
    "v0:" + timestamp + ":" + querystring.stringify(req.body);
  hmac.update(sig_basestring);
  const my_signature = "v0=" + hmac.digest("hex");
  return Buffer.from(my_signature);
};

const validator = req => {
  const slack_signature = Buffer.from(req.headers["X-Slack-Signature"]);
  const my_signature = getSignature(req);
  return crypto.timingSafeEqual(slack_signature, my_signature);
};

module.exports = validator;
