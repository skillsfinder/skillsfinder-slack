const init = () => {
  const db = require("./database")();

  const getPeopleSkillBySkill = (skill, team_id) =>
    db
      .collection("workspaces")
      .doc(team_id)
      .collection("users")
      .where(`skills.${skill}.${skill}`, "==", true)
      .get();

  const getPeopleSkillDB = (req, res) => {
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

    console.log("getpeopleskill", req.body);

    const skill = text;
    let message;

    if (skill == "") {
      message = "Please send a skill. Ej: /getpeopleskill myskill";
      return Promise.resolve(res.send(message));
    }

    return getPeopleSkillBySkill(skill, team_id).then(docs => {
      const users = docs.docs.reduce(
        (acc, curr) => `${acc}\n• ${curr.data().user_name}`,
        ""
      );
      message = `Found users that match skill ${skill}:${users}`;
      if (users == "")
        message = "There is no coincidence. Please try with a similar word";

      return res.send(message);
    });
  };

  return getPeopleSkillDB;
};

module.exports = init;
