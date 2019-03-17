const skill = {
  me: ["myskill", "myskill1", "my skill", "my skill1"],
  other: ["myskill", "my skill", "other skill", "others skills1"]
};

describe("getpeopleskill-db", () => {
  let req, res, getPeopleSkillDB, admin, test, db;

  beforeEach(() => {
    jest.resetModules();
    admin = require("firebase-admin");
    test = require("firebase-functions-test")();
    jest.mock("firebase-admin");

    admin.initializeApp.mockReturnValue();
    req = mockedReq();
    res = mockRes();

    db = mockDB(req);
    admin.firestore = jest.fn().mockReturnValue(db);
    getPeopleSkillDB = require("../src/getpeopleskill-db");
  });

  afterEach(() => {
    test.cleanup();
  });

  it("sends a list of users that mach a skill", () => {
    return getPeopleSkillDB()(req, res).then(() => {
      const result = `Found users that match skill myskill:\n• me things\n• other things`;
      expect(res.send).toBeCalledWith(result);
    });
  });

  it("calls where function with correct params", () => {
    return getPeopleSkillDB()(req, res).then(() => {
      expect(db.where).toBeCalledWith("skills.myskill.myskill", "==", true);
    });
  });

  it("responds a error message when getpeopleskill it called with no params", () => {
    req.body.text = "";
    db = mockDB(req);
    admin.firestore = jest.fn().mockReturnValue(db);
    getPeopleSkillDB = require("../src/getpeopleskill-db");
    return getPeopleSkillDB()(req, res).then(() => {
      const result = "Please send a skill. Ej: /getpeopleskill myskill";
      expect(res.send).toBeCalledWith(result);
    });
  });

  it("responds an error message when there is no match against the database", () => {
    db = mockDB(req);
    db.get = jest.fn().mockResolvedValue({ docs: [] });
    admin.firestore = jest.fn().mockReturnValue(db);
    getPeopleSkillDB = require("../src/getpeopleskill-db");
    return getPeopleSkillDB()(req, res).then(() => {
      const result = "There is no coincidence. Please try with a similar word";
      expect(res.send).toBeCalledWith(result);
    });
  });
});

const mockedReq = () => {
  const req = {
    body: {
      user_name: "jona",
      user_id: "jona",
      command: "/getpeopleskill",
      team_id: "CODE",
      team_domain: "my-team",
      text: "myskill"
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
  const data = user_id => ({
    skills: {
      [skill[user_id][0]]: {
        [skill[user_id][0]]: true,
        score: 0,
        name: skill[user_id][2]
      },
      [skill[user_id][1]]: {
        [skill[user_id][1]]: true,
        score: 0,
        name: skill[user_id][3]
      }
    },
    user_name: user_id + " things"
  });

  const snapshots = [{ data: () => data("me") }, { data: () => data("other") }];

  const db = {};
  db.collection = jest.fn(() => db);
  db.doc = jest.fn(() => db);
  db.where = jest.fn(() => db);
  db.get = jest.fn().mockResolvedValue({ docs: snapshots });
  return db;
};
