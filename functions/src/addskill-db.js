const slugify = require("slugify");

const init = () => {
  const db = require("./database")();

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

    console.log("addskill", req.body);

    const slug = slugify(text, { lower: true });
    const doc = db.collection("workspaces").doc(team_id);

    return doc
      .set({ team_domain })
      .then(() =>
        doc
          .collection("users")
          .doc(user_id)
          .set(
            {
              user_name,
              skills: {
                [slug]: { [slug]: true, score: 0, name: text.toLowerCase() }
              }
            },
            { merge: true }
          )
      )
      .then(() => res.status(200).send(`Successful added skill: ${text}`));
  };

  return addSkillDB;
};

module.exports = init;
