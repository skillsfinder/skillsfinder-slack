const admin = require("firebase-admin");
const test = require("firebase-functions-test")();
const getSkillDB = require("../src/getskill-db");

jest.mock("firebase-admin");

describe("getskill-db", () => {
  let req, res;
  beforeEach(() => {
    admin.initializeApp.mockReturnValue();
    req = mockedReq();
    res = mockRes();

    const db = mockDB(req);
    admin.firestore = jest.fn().mockReturnValue(db);
  });

  afterEach(() => {
    test.cleanup();
  });

  it("sends a list with skills", () => {
    return getSkillDB()(req, res).then(() => {
      const result = "Skills:\n* myskill\n* myskill1\n";
      expect(res.send).toBeCalledWith(result);
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

const mockDB = req => {
  const data = {
    skills: {
      [req.body.text]: { [req.body.text]: true, score: 0 },
      [req.body.text + 1]: { [req.body.text + 1]: true, score: 0 }
    },
    user_name: req.body.user_name
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
