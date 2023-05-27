/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Events
 *
 * `volumeChange` is not officially supported but seems to work
 * it emits an object: `{volume: 82.6923076923077, muted: false}`
 */
const eventNames = [
  "apiChange",
  "error",
  "playbackQualityChange",
  "playbackRateChange",
  "ready",
  "stateChange",
  "volumeChange",
] as const;

export default eventNames;
