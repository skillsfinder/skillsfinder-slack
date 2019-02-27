const init = () => {
  const db = require("./database")();

  const getSkillByUser = (user_id, team_id) =>
    db
      .collection("workspaces")
      .doc(team_id)
      .collection("users")
      .doc(user_id)
      .get();

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

    let required_user_id = user_id;
    const userReg = /<@([WU][0-9A-Z]+)\|?\S*>/;
    if (text && text.match(userReg)) {
      required_user_id = text.match(userReg)[1];
      console.log(`Requesting a specific user: ${required_user_id}`);
    }

    return getSkillByUser(required_user_id, team_id).then(doc => {
      const list = Object.keys(doc.data().skills).map(v => `• ${v}\n`);
      const message =
        required_user_id == user_id
          ? `Skills:\n${list.join("")}`
          : `Skills of ${doc.data().user_name}:\n${list.join("")}`;
      res.send(message);
    });
  };

  return getSkillDB;
};

module.exports = init;
