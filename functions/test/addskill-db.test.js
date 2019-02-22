const admin = require("firebase-admin");
const test = require("firebase-functions-test")();
const addSkillDB = require("../src/addskill-db");

jest.mock("firebase-admin");

describe("addskill-db", () => {
  let req, res, set;
  beforeEach(() => {
    admin.initializeApp.mockReturnValue();
    set = jest.fn().mockResolvedValue();
    const db = mockDB(set);

    admin.firestore = jest.fn().mockReturnValue(db);

    req = mockedReq();
    res = mockRes();
  });

  afterEach(() => {
    test.cleanup();
  });

  it("calls set in document", () => {
    return addSkillDB()(req, res).then(() => {
      expect(set).toBeCalledWith({
        skills: { myskill: { score: 0, myskill: true } },
        user_name: "jona"
      });
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
      team_id: "CODE"
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

const mockDB = set => {
  const db = {};
  db.collection = jest.fn(() => db);
  db.doc = jest.fn(() => db);
  db.set = set;
  return db;
};
