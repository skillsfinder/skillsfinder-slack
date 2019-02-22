const init = () => {
  const functions = require("firebase-functions");
  const admin = require("firebase-admin");
  admin.initializeApp(functions.config().firebase);
  const db = admin.firestore();

  const addSkillDB = (req, res) => {
    const {
      team_id,
      team_domain,
      channel_id,
      channel_name,
      user_id,
      user_name,
      command,
      text,
      response_url,
      trigger_id
    } = req.body;

    console.log(req.body);

    return db
      .collection("workspaces")
      .doc(team_id)
      .set({ team_domain })
      .collection("users")
      .doc(user_id)
      .set({ user_name, skills: { [text]: { [text]: true, score: 0 } } })
      .then(() => res.status(200).send(`Successful added skill ${text}`));
  };

  return addSkillDB;
};

module.exports = init;
