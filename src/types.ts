import eventNames from "./eventNames";
import { Emitter } from "./events";

export type IframeApi = {
  Player: new (
    ref: string | HTMLElement,
    options?: YT.PlayerOptions
  ) => YouTubePlayer;
};

export type EventKey = (typeof eventNames)[number];

export type PlayerEvents = Pick<
  Emitter<Record<EventKey, () => void>>,
  "on" | "off"
>;

export type PromisePlayer = {
  [K in keyof YouTubePlayer]: (
    ...args: Parameters<YouTubePlayer[K]>
  ) => Promise<ReturnType<YouTubePlayer[K]>>;
} & PlayerEvents;

/**
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
export type YouTubePlayer = {
  addEventListener: (event: string, listener: Function) => void;
  destroy: () => void;
  getAvailablePlaybackRates: () => ReadonlyArray<number>;
  getAvailableQualityLevels: () => ReadonlyArray<string>;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => HTMLIFrameElement;
  getOption: () => unknown;
  getOptions: () => unknown;
  setOption: () => void;
  setOptions: () => void;
  cuePlaylist: (
    playlist: string | ReadonlyArray<string>,
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    listType: string;
    list?: string;
    index?: number;
    startSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  loadPlaylist: (
    playlist: string | ReadonlyArray<string>,
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    listType: string;
    list?: string;
    index?: number;
    startSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  getPlaylist: () => ReadonlyArray<string>;
  getPlaylistIndex: () => number;
  getPlaybackQuality: () => string;
  getPlaybackRate: () => number;
  getPlayerState: () => number;
  getVideoEmbedCode: () => string;
  getVideoLoadedFraction: () => number;
  getVideoUrl: () => string;
  getVolume: () => number;
  cueVideoById: (
    videoId: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  cueVideoByUrl: (
    mediaContentUrl: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    mediaContentUrl: string;
    startSeconds?: number;
    endSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  loadVideoByUrl: (
    mediaContentUrl: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    mediaContentUrl: string;
    startSeconds?: number;
    endSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  loadVideoById: (
    videoId: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => (options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
    suggestedQuality?: string;
  }) => void;
  isMuted: () => boolean;
  mute: () => void;
  nextVideo: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  playVideoAt: (index: number) => void;
  previousVideo: () => void;
  removeEventListener: (event: string, listener: Function) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
  setPlaybackQuality: (suggestedQuality: string) => void;
  setPlaybackRate: (suggestedRate: number) => void;
  setShuffle: (shufflePlaylist: boolean) => void;
  setSize: (width: number, height: number) => Object;
  setVolume: (volume: number) => void;
  stopVideo: () => void;
  unMute: () => void;
  getSphericalProperties: () => {
    fov: number;
    yaw: number;
    pitch: number;
    roll: number;
    enableOrientationSensor: boolean;
  };
  setSphericalProperties: (properties: {
    fov?: number;
    yaw?: number;
    pitch?: number;
    roll?: number;
    enableOrientationSensor?: boolean;
  }) => void;
};
