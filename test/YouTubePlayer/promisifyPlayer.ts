import { test } from "vitest";
import YouTubePlayer from "../../src/YouTubePlayer";
import functionNames from "../../src/functionNames";
import { type YouTubePlayerType } from "../../src/types";

test("is a function", (t) => {
  t.expect(YouTubePlayer).toBeInstanceOf(Function);
});

// TODO: redo these tests completely

// test("converts all API methods to asynchronous functions", async (t) => {
//   const mockPlayer = {} as YouTubePlayerType;
//   const mockArgument = {};
//   const playerAPIReady: Promise<YouTubePlayerType> = new Promise((resolve) => {
//     resolve(mockPlayer);
//   });
//   const functions = YouTubePlayer.promisifyPlayer(playerAPIReady);

//   for (const fname of functionNames) {
//     // use function expression instead of arrow function expression to bind its own this
//     mockPlayer[fname] = function (argument) {
//       return [this, argument];
//     };

//     const promise = functions[fname](mockArgument);

//     t.expect(promise).toBeInstanceOf(Promise)

//     const result = await promise;

//     t.expect(result[0]).toEqual(mockPlayer)
//     t.expect(result[1]).toEqual(mockArgument)
//   }
// });
