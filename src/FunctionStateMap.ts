import PlayerState from "./constants/PlayerState";

export default {
  pauseVideo: {
    acceptableStates: [PlayerState.ENDED, PlayerState.PAUSED],
    stateChangeRequired: false,
  },
  playVideo: {
    acceptableStates: [PlayerState.ENDED, PlayerState.PLAYING],
    stateChangeRequired: false,
  },
  seekTo: {
    acceptableStates: [
      PlayerState.ENDED,
      PlayerState.PLAYING,
      PlayerState.PAUSED,
    ],
    stateChangeRequired: true,
    // TRICKY: `seekTo` may not cause a state change if no buffering is
    // required.
    timeout: 3_000,
  },
} as const;
