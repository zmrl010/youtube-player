// @flow

/* eslint-disable promise/prefer-await-to-then */

import createDebug from "debug";
import FunctionStateMap from "./FunctionStateMap";
import eventNames from "./eventNames";
import functionNames from "./functionNames";
import type { Emitter, YouTubePlayer } from "./types";

type EventHandlerMapType = {
  [key: string]: (event: Object) => void;
};

const debug = createDebug("youtube-player");

/**
 * Construct an object that defines an event handler for all of the YouTube
 * player events. Proxy captured events through an event emitter.
 *
 * @todo Capture event parameters.
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 */
export const proxyEvents = (emitter: Emitter): EventHandlerMapType => {
  const events: EventHandlerMapType = {};

  for (const eventName of eventNames) {
    const onEventName =
      "on" + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);

    events[onEventName] = (event) => {
      debug('event "%s"', onEventName, event);

      emitter.trigger(eventName, event);
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
) => {
  const functions: Partial<
    Record<
      (typeof functionNames)[number],
      YouTubePlayer[(typeof functionNames)[number]]
    >
  > = {};

  for (const functionName of functionNames) {
    if (strictState && functionName in FunctionStateMap) {
      functions[functionName] = async (...args) => {
        const player = await playerAPIReady;
        const stateInfo = FunctionStateMap[functionName];
        const playerState = player.getPlayerState();
        // eslint-disable-next-line no-warning-comments
        // TODO: Just spread the args into the function once Babel is fixed:
        // https://github.com/babel/babel/issues/4270
        //
        // eslint-disable-next-line prefer-spread
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

  return functions;
};
