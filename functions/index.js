const functions = require("firebase-functions");
const addSkillDB = require("./src/addskill-db")();
const bodyParser = require("body-parser").urlencoded({ extended: false });
const validatorMiddleware = require("./src/validator-middleware");

exports.addSkill = functions.https.onRequest((req, res) =>
  bodyParser(req, res, () => {
    if (req.body.command) {
      return validatorMiddleware(req, res, () => {
        if (req.method === "POST") {
          return addSkillDB(req, res);
        }

        return res.status(500).send("Expected a POST request");
      });
    }
    return res.status(200).end();
  })
);
