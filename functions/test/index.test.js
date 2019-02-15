// const admin = require("firebase-admin");
const test = require("firebase-functions-test")();

describe("index", () => {
  describe("addSkill", () => {
    let myFunctions;

    beforeEach(() => {
      myFunctions = require("../index");
    });

    afterEach(() => {
      test.cleanup();
    });

    it("responds 200 only on POST verb", done => {
      const req = {};
      req.method = "POST";

      const res = {};
      res.statusCode = 500;
      res.status = statusCode => {
        res.statusCode = statusCode;
        return res;
      };
      res.send = () => {
        expect(res.statusCode).toBe(200);
        done();
      };

      myFunctions.addSkill(req, res);
    });
  });
});
