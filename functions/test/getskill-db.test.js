const skill = {
  me: ["myskill", "myskill1"],
  U012ABCDEF: ["others-skills", "others-skills1"]
};

describe("getskill-db", () => {
  let req, res, getSkillDB, admin, test;

  beforeEach(() => {
    jest.resetModules();
    admin = require("firebase-admin");
    test = require("firebase-functions-test")();
    jest.mock("firebase-admin");

    admin.initializeApp.mockReturnValue();
    req = mockedReq();
    res = mockRes();

    const db = mockDB(req);
    admin.firestore = jest.fn().mockReturnValue(db);
    getSkillDB = require("../src/getskill-db");
  });

  afterEach(() => {
    test.cleanup();
  });

  it("sends a list with my own skills", () => {
    return getSkillDB()(req, res).then(() => {
      const result = `Skills:\n• ${skill.me[0]}\n• ${skill.me[1]}\n`;
      expect(res.send).toBeCalledWith(result);
    });
  });

  it("sends a list with other user skills", () => {
    req.body.text = "<@U012ABCDEF|joyarzun>";
    const db = mockDB(req);
    admin.firestore = jest.fn().mockReturnValue(db);

    return getSkillDB()(req, res).then(() => {
      const result = `Skills of juan:\n• ${skill.U012ABCDEF[0]}\n• ${
        skill.U012ABCDEF[1]
      }\n`;
      expect(res.send).toBeCalledWith(result);
    });
  });
});

const mockedReq = () => {
  const req = {
    body: {
      user_name: "jona",
      user_id: "jona",
      command: "/addskill",
      team_id: "CODE",
      team_domain: "my-team"
    }
  };
  req.method = "POST";
  return req;
};

const mockRes = () => {
  const res = {};
  res.statusCode = 500;
  res.status = statusCode => {
    res.statusCode = statusCode;
    return res;
  };
  res.end = jest.fn();
  res.send = jest.fn();
  return res;
};

const mockDB = req => {
  let user_id = "me";
  const userReg = /<@([WU][0-9A-Z]+)\|?\S*>/;
  if (req.body.text && req.body.text.match(userReg)) {
    user_id = req.body.text.match(userReg)[1];
  }

  const data = {
    skills: {
      [skill[user_id][0]]: { [skill[user_id][0]]: true, score: 0 },
      [skill[user_id][1]]: { [skill[user_id][1]]: true, score: 0 }
    },
    user_name: "juan"
  };
  const db = {};
  db.collection = jest.fn(() => db);
  db.doc = jest.fn(() => db);
  const snapshot = {
    data: jest.fn(() => data)
  };
  db.get = jest.fn().mockResolvedValue(snapshot);
  return db;
};
