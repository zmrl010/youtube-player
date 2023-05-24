import { test } from "vitest";
import functionNames from "../src/functionNames";

test("is an array of function names", (t) => {
  t.expect(Array.isArray(functionNames)).toBeTruthy();
});
