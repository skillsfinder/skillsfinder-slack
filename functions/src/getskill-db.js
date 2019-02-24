const init = () => {
  const db = require("./database");

  const getSkillDB = (req, res) => {
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

    console.log("getskill", req.body);

    return db
      .collection("workspaces")
      .doc(team_id)
      .collection("users")
      .doc(user_id)
      .get()
      .then(doc => {
        const list = Object.keys(doc.data().skills).map(v => `• ${v}\n`);
        res.send(`Skills:\n${list.join("")}`);
      });
  };

  return getSkillDB;
};

module.exports = init;
