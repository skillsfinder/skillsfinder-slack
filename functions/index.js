const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser").urlencoded({ extended: false });
const validatorMiddleware = require("./src/validator-middleware");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addSkill = functions.https.onRequest((req, res) =>
  bodyParser(req, res, () => {
    if (req.body.command) {
      return validatorMiddleware(req, res, () => {
        if (req.method === "POST") {
          const username = req.body.user_name;
          const text = req.body.text;

          return db
            .collection("users")
            .doc(username)
            .set({ skill: text })
            .then(() => res.status(200).send(`Successful added skill ${text}`));
        }

        return res.status(500).send("Expected a POST request");
      });
    }
    return res.status(200).end();
  })
);
