const validator = require("./request-validator");

const middleware = (req, res, next) => {
  if (!validator(req)) throw new Error("Request no validated from slack");
  next();
};

module.exports = middleware;
