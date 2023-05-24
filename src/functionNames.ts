// @flow

/**
 * @see https://developers.google.com/youtube/iframe_api_reference#Functions
 */
export default [
  "cueVideoById",
  "loadVideoById",
  "cueVideoByUrl",
  "loadVideoByUrl",
  "playVideo",
  "pauseVideo",
  "stopVideo",
  "getVideoLoadedFraction",
  "cuePlaylist",
  "loadPlaylist",
  "nextVideo",
  "previousVideo",
  "playVideoAt",
  "setShuffle",
  "setLoop",
  "getPlaylist",
  "getPlaylistIndex",
  "setOption",
  "mute",
  "unMute",
  "isMuted",
  "setVolume",
  "getVolume",
  "seekTo",
  "getPlayerState",
  "getPlaybackRate",
  "setPlaybackRate",
  "getAvailablePlaybackRates",
  "getPlaybackQuality",
  "setPlaybackQuality",
  "getAvailableQualityLevels",
  "getCurrentTime",
  "getDuration",
  "removeEventListener",
  "getVideoUrl",
  "getVideoEmbedCode",
  "getOptions",
  "getOption",
  "addEventListener",
  "destroy",
  "setSize",
  "getIframe",
  "getSphericalProperties",
  "setSphericalProperties",
] as const;
