const validatorMiddleware = require("./validator-middleware");
const getPeopleSkillDB = require("./getpeopleskill-db")();

const getPeopleSkill = (req, res) => {
  if (req.body.command) {
    return validatorMiddleware(req, res, () => {
      if (req.method === "POST") {
        return getPeopleSkillDB(req, res);
      }

      return res.status(500).send("Expected a POST request");
    });
  }
  return res.status(200).end();
};

module.exports = getPeopleSkill;
