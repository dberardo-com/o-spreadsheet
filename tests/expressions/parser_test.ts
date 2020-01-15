import { parse } from "../../src/expressions";

describe("parser", () => {
  test("can parse a function call with no argument", () => {
    expect(parse("RAND()")).toEqual({ debug: false, type: "FUNCALL", value: "RAND", args: [] });
  });
  test("AND", () => {
    expect(parse("=AND(true, false)")).toEqual({
      debug: false,
      type: "FUNCALL",
      value: "AND",
      args: [
        { type: "BOOLEAN", value: true },
        { type: "BOOLEAN", value: false }
      ]
    });
    expect(parse("=AND(0, tRuE)")).toEqual({
      debug: false,
      type: "FUNCALL",
      value: "AND",
      args: [
        { type: "NUMBER", value: 0 },
        { type: "BOOLEAN", value: true }
      ]
    });
  });
});
