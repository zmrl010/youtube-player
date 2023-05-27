import type eventNames from "./eventNames";
import { type Emitter } from "./events";

export type IframeApi = {
  Player: new (
    ref: HTMLElement | string,
    options?: YT.PlayerOptions
  ) => YouTubePlayer;
};

export type EventKey = (typeof eventNames)[number];

export type PlayerEvents = Pick<
  Emitter<Record<EventKey, () => void>>,
  "off" | "on"
>;

export type PromiseProxyPlayer = PlayerEvents & {
  [K in keyof YouTubePlayer]: (
    ...args: Parameters<YouTubePlayer[K]>
  ) => Promise<ReturnType<YouTubePlayer[K]>>;
};

/**
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
export type YouTubePlayer = {
  addEventListener: (event: string, listener: Function) => void;
  cuePlaylist: ((
    playlist: string | readonly string[],
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      index?: number;
      list?: string;
      listType: string;
      startSeconds?: number;
      suggestedQuality?: string;
    }) => void);
  cueVideoById: ((
    videoId: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      endSeconds?: number;
      startSeconds?: number;
      suggestedQuality?: string;
      videoId: string;
    }) => void);
  cueVideoByUrl: ((
    mediaContentUrl: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      endSeconds?: number;
      mediaContentUrl: string;
      startSeconds?: number;
      suggestedQuality?: string;
    }) => void);
  destroy: () => void;
  getAvailablePlaybackRates: () => readonly number[];
  getAvailableQualityLevels: () => readonly string[];
  getCurrentTime: () => number;
  getDuration: () => number;
  getIframe: () => HTMLIFrameElement;
  getOption: () => unknown;
  getOptions: () => unknown;
  getPlaybackQuality: () => string;
  getPlaybackRate: () => number;
  getPlayerState: () => number;
  getPlaylist: () => readonly string[];
  getPlaylistIndex: () => number;
  getSphericalProperties: () => {
    enableOrientationSensor: boolean;
    fov: number;
    pitch: number;
    roll: number;
    yaw: number;
  };
  getVideoEmbedCode: () => string;
  getVideoLoadedFraction: () => number;
  getVideoUrl: () => string;
  getVolume: () => number;
  isMuted: () => boolean;
  loadPlaylist: ((
    playlist: string | readonly string[],
    index?: number,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      index?: number;
      list?: string;
      listType: string;
      startSeconds?: number;
      suggestedQuality?: string;
    }) => void);
  loadVideoById: ((
    videoId: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      endSeconds?: number;
      startSeconds?: number;
      suggestedQuality?: string;
      videoId: string;
    }) => void);
  loadVideoByUrl: ((
    mediaContentUrl: string,
    startSeconds?: number,
    suggestedQuality?: string
  ) => void) &
    ((options: {
      endSeconds?: number;
      mediaContentUrl: string;
      startSeconds?: number;
      suggestedQuality?: string;
    }) => void);
  mute: () => void;
  nextVideo: () => void;
  pauseVideo: () => void;
  playVideo: () => void;
  playVideoAt: (index: number) => void;
  previousVideo: () => void;
  removeEventListener: (event: string, listener: Function) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setLoop: (loopPlaylists: boolean) => void;
  setOption: () => void;
  setOptions: () => void;
  setPlaybackQuality: (suggestedQuality: string) => void;
  setPlaybackRate: (suggestedRate: number) => void;
  setShuffle: (shufflePlaylist: boolean) => void;
  setSize: (width: number, height: number) => Object;
  setSphericalProperties: (properties: {
    enableOrientationSensor?: boolean;
    fov?: number;
    pitch?: number;
    roll?: number;
    yaw?: number;
  }) => void;
  setVolume: (volume: number) => void;
  stopVideo: () => void;
  unMute: () => void;
};
