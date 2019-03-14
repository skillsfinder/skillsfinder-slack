// const admin = require("firebase-admin");
// const test = require("firebase-functions-test")();
// const addSkillDB = require("../src/addskill-db");

describe("addskill-db", () => {
  let req, res, set, admin, test, addSkillDB;
  beforeEach(() => {
    jest.resetModules();
    admin = require("firebase-admin");
    test = require("firebase-functions-test")();
    addSkillDB = require("../src/addskill-db");
    jest.mock("firebase-admin");

    admin.initializeApp.mockReturnValue();
    const db = mockDB();
    set = db.set = jest.fn(() => Promise.resolve());

    admin.firestore = jest.fn().mockReturnValue(db);

    req = mockedReq();
    res = mockRes();
  });

  afterEach(() => {
    test.cleanup();
  });

  it("calls set in document", () => {
    return addSkillDB()(req, res).then(() => {
      const firstResult = { team_domain: "my-team" };

      const secondResult = {
        skills: { myskill: { myskill: true, score: 0, name: "myskill" } },
        user_name: "jona"
      };

      expect(set.mock.calls[0][0]).toEqual(firstResult);
      expect(set.mock.calls[1][0]).toEqual(secondResult);
    });
  });

  it("adds a skill with spaces and upper", () => {
    req.body.text = "My Skill";

    return addSkillDB()(req, res).then(() => {
      const result = {
        skills: {
          "my-skill": { "my-skill": true, score: 0, name: "my skill" }
        },
        user_name: "jona"
      };

      expect(set.mock.calls[1][0]).toEqual(result);
    });
  });
});

const mockedReq = () => {
  const req = {
    body: {
      user_name: "jona",
      user_id: "jona",
      text: "myskill",
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

const mockDB = () => {
  const db = {};
  db.collection = jest.fn(() => db);
  db.doc = jest.fn(() => db);
  return db;
};
