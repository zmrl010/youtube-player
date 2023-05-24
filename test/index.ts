import { test } from "vitest";
import PublicAPIConstructor from "../src";

test("is a function", (t) => {
  t.expect(PublicAPIConstructor).toBeInstanceOf(Function);
});
