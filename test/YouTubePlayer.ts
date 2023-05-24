import { test } from "vitest";
import YouTubePlayer from "../src/YouTubePlayer";

test("is a function", (t) => {
  t.expect(YouTubePlayer).toBeInstanceOf(Object);
});
