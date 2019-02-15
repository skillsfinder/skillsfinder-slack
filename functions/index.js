const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser").urlencoded({ extended: false });

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addSkill = functions.https.onRequest((req, res) =>
  bodyParser(req, res, () => {
    if (req.method === "POST") {
      const username = req.body.user_name;
      const text = req.body.text;

      return db
        .collection("users")
        .doc(username)
        .set({ skill: text })
        .then(snapshot =>
          res.status(200).send(`Successful added skill ${snapshot.skill}`)
        );
    }

    return res.status(500).end();
  })
);
