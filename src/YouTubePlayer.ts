import createDebug from "debug";
import FunctionStateMap from "./FunctionStateMap";
import eventNames from "./eventNames";
import functionNames from "./functionNames";
import type { PromisePlayer, YouTubePlayer } from "./types";
import { type HandlerMap, type Emitter } from "./events";

const debug = createDebug("youtube-player");

type ProxyEventMap<Events extends HandlerMap> = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: Events[K];
};

const capitalize = <S extends string>(str: S): Capitalize<S> =>
  (str.slice(0, 1).toUpperCase() + str.slice(1)) as Capitalize<S>;

/**
 * Construct an object that defines an event handler for all of the YouTube
 * player events. Proxy captured events through an event emitter.
 *
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
export const proxyEvents = <Events extends HandlerMap>(
  emitter: Emitter<Events>
): ProxyEventMap<Events> => {
  const events = {} as ProxyEventMap<Events>;

  for (const eventName of eventNames) {
    const onEventName = `on${capitalize(eventName)}` as const;

    events[onEventName] = (...args: Parameters<Events[typeof eventName]>) => {
      debug('event "%s"', onEventName, ...args);

      emitter.trigger(eventName, ...args);
    };
  }

  return events;
};

/**
 * Delays player API method execution until player state is ready.
 *
 * @todo Proxy all of the methods using Object.keys.
 * @todo See TRICKY below.
 *
 * @param playerAPIReady Promise that resolves when player is ready.
 * @param strictState A flag designating whether or not to wait for
 * an acceptable state when calling supported functions.
 */
export const promisifyPlayer = (
  playerAPIReady: Promise<YouTubePlayer>,
  strictState: boolean = false
): PromisePlayer => {
  const functions = {} as PromisePlayer;

  for (const functionName of functionNames) {
    if (strictState && functionName in FunctionStateMap) {
      functions[functionName] = async (...args) => {
        const player = await playerAPIReady;
        const stateInfo = FunctionStateMap[functionName];
        const playerState = player.getPlayerState();

        const value = player[functionName](...args);
        // TRICKY: For functions like `seekTo`, a change in state must be
        // triggered given that the resulting state could match the initial
        // state.
        if (
          stateInfo.stateChangeRequired ||
          // eslint-disable-next-line no-extra-parens
          (Array.isArray(stateInfo.acceptableStates) &&
            !stateInfo.acceptableStates.includes(playerState))
        ) {
          return new Promise((resolve) => {
            const onPlayerStateChange = () => {
              const playerStateAfterChange = player.getPlayerState();

              let timeout;

              if (typeof stateInfo.timeout === "number") {
                timeout = setTimeout(() => {
                  player.removeEventListener(
                    "onStateChange",
                    onPlayerStateChange
                  );

                  resolve();
                }, stateInfo.timeout);
              }

              if (
                Array.isArray(stateInfo.acceptableStates) &&
                stateInfo.acceptableStates.includes(playerStateAfterChange)
              ) {
                player.removeEventListener(
                  "onStateChange",
                  onPlayerStateChange
                );

                clearTimeout(timeout);

                resolve();
              }
            };

            player.addEventListener("onStateChange", onPlayerStateChange);
          }).then(() => {
            return value;
          });
        }
        return value;
      };
    } else {
      functions[functionName] = async (...args) => {
        const player = await playerAPIReady;

        return player[functionName](...args);
      };
    }
  }

  return functions as PromisePlayer;
};
