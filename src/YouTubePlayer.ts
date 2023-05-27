import eventNames from "./eventNames";
import { type Emitter, type HandlerMap } from "./events";
import functionNames from "./functionNames";
import FunctionStateMap from "./FunctionStateMap";
import {
  type EventKey,
  type PromiseProxyPlayer,
  type YouTubePlayer,
} from "./types";
import createDebug from "debug";

const debug = createDebug("youtube-player");

type ProxyEventMap<Events extends HandlerMap> = {
  [K in keyof Events as `on${Capitalize<Extract<K, string>>}`]: Events[K];
};

const capitalize = <S extends string>(string_: S): Capitalize<S> => {
  return (string_.slice(0, 1).toUpperCase() +
    string_.slice(1)) as Capitalize<S>;
};

/**
 * Construct an object that defines an event handler for all of the YouTube
 * player events. Proxy captured events through an event emitter.
 *
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
export const proxyEvents = <EventMap extends Record<EventKey, () => unknown>>(
  emitter: Emitter<EventMap>
): ProxyEventMap<EventMap> => {
  const eventEntries = eventNames.map((eventName) => {
    const name = `on${capitalize(eventName)}` as const;

    const handler = (...args: Parameters<EventMap[typeof eventName]>) => {
      debug('event "%s"', name, ...args);

      emitter.trigger(eventName, ...args);
    };

    return [name, handler] as const;
  });

  return Object.fromEntries(eventEntries) as ProxyEventMap<EventMap>;
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
): PromiseProxyPlayer => {
  const functions = {} as PromiseProxyPlayer;

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

  return functions as PromiseProxyPlayer;
};
