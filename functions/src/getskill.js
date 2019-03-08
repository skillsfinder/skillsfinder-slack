const validatorMiddleware = require("./validator-middleware");
const getSkillDB = require("./getskill-db")();

const getSkill = (req, res) => {
  if (req.body.command) {
    return validatorMiddleware(req, res, () => {
      if (req.method === "POST") {
        return getSkillDB(req, res);
      }

      return res.status(500).send("Expected a POST request");
    });
  }
  return res.status(200).end();
};

module.exports = getSkill;
