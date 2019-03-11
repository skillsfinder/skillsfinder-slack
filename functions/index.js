const functions = require("firebase-functions");
const addSkill = require("./src/addskill");
const getSkill = require("./src/getskill");
const getPeopleSkill = require("./src/getpeopleskill");

exports.addSkill = functions.https.onRequest(addSkill);

exports.getSkill = functions.https.onRequest(getSkill);

exports.getPeopleSkill = functions.https.onRequest(getPeopleSkill);
