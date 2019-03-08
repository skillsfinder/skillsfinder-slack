const validatorMiddleware = require("./validator-middleware");
const addSkillDB = require("./addskill-db")();

const addskill = (req, res) => {
  if (req.body.command) {
    return validatorMiddleware(req, res, () => {
      if (req.method === "POST") {
        return addSkillDB(req, res);
      }

      return res.status(500).send("Expected a POST request");
    });
  }
  return res.status(200).end();
};

module.exports = addskill;
