const functions = require("firebase-functions");
const addSkill = require("./src/addskill");
const getSkill = require("./src/getskill");

exports.addSkill = functions.https.onRequest(addSkill);

exports.getSkill = functions.https.onRequest(getSkill);
