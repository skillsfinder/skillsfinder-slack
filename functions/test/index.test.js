const admin = require("firebase-admin");
const test = require("firebase-functions-test")();
jest.mock("firebase-admin");

describe("index", () => {
  describe("addSkill", () => {
    let myFunctions, setFn, docFn, req, res;

    beforeEach(() => {
      admin.initializeApp.mockReturnValue();

      setFn = jest.fn().mockResolvedValue({ skill: "skill" });
      docFn = jest.fn().mockReturnValue({ set: setFn });

      const db = {
        collection: () => ({
          doc: docFn
        })
      };

      admin.firestore = jest.fn().mockReturnValue(db);

      myFunctions = require("../index");

      req = { body: { user_name: "jona", text: "skill" } };
      req.method = "POST";
      req.headers = {};
      req.headers["transfer-encoding"] = "utf-8";

      res = {};
      res.statusCode = 500;
      res.status = statusCode => {
        res.statusCode = statusCode;
        return res;
      };
    });

    afterEach(() => {
      test.cleanup();
    });

    it("responds 200 only on POST verb", done => {
      res.send = () => {
        expect(res.statusCode).toBe(200);
        done();
      };

      myFunctions.addSkill(req, res);
    });

    it("adds user and skill to database", done => {
      res.send = message => {
        expect(message).toEqual("Successful added skill skill");
        expect(docFn).toBeCalledWith("jona");
        expect(setFn).toBeCalledWith({ skill: "skill" });
        done();
      };

      myFunctions.addSkill(req, res);
    });
  });
});
