const validator = require("../src/request-validator");
const querystring = require("querystring");
const functions = require("firebase-functions");
jest.mock("firebase-functions");

describe("request validator", () => {
  it("validates the logic on validator", () => {
    functions.config.mockReturnValue({
      slack: { signingsecret: "8f742231b10e8888abcd99yyyzzz85a5" }
    });

    const req = { headers: {} };
    req.headers["x-slack-request-timestamp"] = 1531420618;
    req.headers["x-slack-signature"] =
      "v0=a2114d57b48eac39b9ad189dd8316235a7b4a8d21a10bd27519666489c69b503";
    req.body = querystring.parse(
      "token=xyzz0WbapA4vBCDEFasx0q6G&team_id=T1DC2JH3J&team_domain=testteamnow&channel_id=G8PSS9T3V&channel_name=foobar&user_id=U2CERLKJA&user_name=roadrunner&command=%2Fwebhook-collect&text=&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT1DC2JH3J%2F397700885554%2F96rGlfmibIGlgcZRskXaIFfN&trigger_id=398738663015.47445629121.803a0bc887a14d10d2c447fce8b6703c"
    );

    expect(validator(req)).toBe(true);
  });

  it("validates slack signature with spaces in text", () => {
    functions.config.mockReturnValue({
      slack: { signingsecret: "e7bcb78ae84dd9649cd1ffe77781faf3" }
    });

    const req = { headers: {} };

    req.headers["x-slack-request-timestamp"] = "1551706065";
    req.headers["x-slack-signature"] =
      "v0=54957a71213f0a448aa155f1cc0fc64627ee081b694c374f9bb05b6068eb895b";

    req.body = {
      token: "ttcm2G0HygIwWABvBhmuLs9b",
      team_id: "T18NJ4X2L",
      team_domain: "latam-digital",
      channel_id: "D3KGXR4PR",
      channel_name: "directmessage",
      user_id: "U3JUL6DS9",
      user_name: "joyarzun",
      command: "/addskill",
      text: "java 8",
      response_url:
        "https://hooks.slack.com/commands/T18NJ4X2L/565617458576/QGYIWLnHrEXnGE4VrSBWuxpA",
      trigger_id: "565617458688.42766167088.caca68b591600243a69969b0dd50b90c"
    };

    expect(validator(req)).toBe(true);
  });
});
