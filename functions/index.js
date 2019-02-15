const functions = require("firebase-functions");

exports.addSkill = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    return res.status(200).send("success");
  }
  return res.status(500).end();
});
