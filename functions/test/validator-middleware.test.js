const validatorMiddleware = require("../src/validator-middleware");
const validator = require("../src/request-validator");

jest.mock("../src/request-validator");

describe("Validator middleware", () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it("returns error when request is not valid", () => {
    validator.mockReturnValue(false);
    expect(() => validatorMiddleware(req, res, next)).toThrowError();
  });

  it("calls next when request is valid", () => {
    validator.mockReturnValue(true);
    validatorMiddleware(req, res, next);
    expect(next).toBeCalled();
  });
});
