const test = require("firebase-functions-test")();
const bodyParser = require("body-parser");
const validatorMiddleware = require("../src/validator-middleware");
const addSkillDB = require("../src/addskill-db");
const getSkillDB = require("../src/getskill-db");

jest.mock("body-parser", () => ({ urlencoded: jest.fn() }));
jest.mock("../src/validator-middleware");
jest.mock("../src/addskill-db");
jest.mock("../src/getskill-db");

describe("index", () => {
  let addSkillDBMock, getSkillDBMock, myFunctions, req, res;
  beforeEach(() => {
    bodyParser.urlencoded.mockReturnValue((req, res, next) => next());
    validatorMiddleware.mockImplementation((req, res, next) => next());
    addSkillDBMock = jest.fn();
    addSkillDB.mockReturnValue(addSkillDBMock);
    getSkillDBMock = jest.fn();
    getSkillDB.mockReturnValue(getSkillDBMock);
    jest.isolateModules(() => {
      myFunctions = require("../index");
    });
    req = mockedReq();
    res = mockRes();
  });
  afterEach(() => {
    test.cleanup();
  });

  describe("addSkill", () => {
    it("saves response on database when requirements are met", () => {
      myFunctions.addSkill(req, res);

      expect(addSkillDBMock).toBeCalled();
    });

    it("returns 200 code and does not save to database when command param is not present", () => {
      delete req.body.command;
      myFunctions.addSkill(req, res);

      expect(res.status).toBeCalledWith(200);
    });
  });

  describe("getSkill", () => {
    it("calls getSkilldb when a valid request comes to /getskill", () => {
      myFunctions.getSkill(req, res);

      return expect(getSkillDBMock).toBeCalled();
    });

    it("returns 200 code and does not save to database when command param is not present", () => {
      delete req.body.command;
      myFunctions.getSkill(req, res);

      expect(res.status).toBeCalledWith(200);
    });
  });
});

const mockedReq = () => {
  const req = {
    body: { user_name: "jona", text: "skill", command: "/somecommand" }
  };
  req.method = "POST";
  return req;
};

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.end = jest.fn(() => res);
  return res;
};
