import { createEventEmitter } from "./events";
import { promisifyPlayer, proxyEvents } from "./YouTubePlayer";
import loadYouTubeIframeApi from "./loadYouTubeIframeApi";
import type FunctionStateMap from "./FunctionStateMap";
import type { IframeApi, YouTubePlayer } from "./types";

/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
 */
type Options = {
  events?: YT.Events;
  height?: number;
  playerVars?: YT.PlayerVars;
  videoId?: string;
  width?: number;
};

/**
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
let youtubeIframeAPI: Promise<IframeApi>;

/**
 * A factory function used to produce an instance of YT.Player and
 * queue function calls and proxy events of the resulting object.
 *
 * @param maybeElementId Either An existing YT.Player instance,
 * the DOM element or the id of the HTML element where the API will insert
 * an <iframe>.
 * @param options See `options` (Ignored when using an existing
 * YT.Player instance).
 * @param strictState A flag designating whether or not to wait for
 * an acceptable state when calling supported functions. Default: `false`.
 *
 * @see {@link FunctionStateMap} for supported functions and acceptable
 * states.
 */
export default (
  maybeElementId: string | HTMLElement | YouTubePlayer,
  options: Options = {},
  strictState: boolean = false
) => {
  const emitter = createEventEmitter();

  if (!youtubeIframeAPI) {
    youtubeIframeAPI = loadYouTubeIframeApi(emitter);
  }

  if (options.events) {
    throw new Error("Event handlers cannot be overwritten.");
  }

  // eslint-disable-next-line unicorn/prefer-query-selector
  if (
    typeof maybeElementId === "string" &&
    !document.getElementById(maybeElementId)
  ) {
    throw new Error('Element "' + maybeElementId + '" does not exist.');
  }

  options.events = proxyEvents(emitter);

  const playerAPIReady = new Promise(
    (resolve: (result: YouTubePlayer) => void) => {
      if (typeof maybeElementId === "object" && "playVideo" in maybeElementId) {
        resolve(maybeElementId);
      } else {
        // assume maybeElementId can be rendered inside
        // eslint-disable-next-line promise/catch-or-return
        youtubeIframeAPI.then((YT) => {
          // eslint-disable-line promise/prefer-await-to-then
          const player = new YT.Player(maybeElementId as string, options);

          emitter.on("ready", () => {
            resolve(player);
          });

          return null;
        });
      }
    }
  );

  const playerApi = promisifyPlayer(playerAPIReady, strictState);

  playerApi.on = emitter.on;
  playerApi.off = emitter.off;

  return playerApi;
};
