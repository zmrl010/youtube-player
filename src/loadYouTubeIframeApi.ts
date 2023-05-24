import load from "load-script";
import type { Emitter, IframeApi } from "./types";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export default (emitter: Emitter): Promise<IframeApi> => {
  /**
   * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
   * The promise is resolved with a reference to window.YT object.
   */
  const iframeAPIReady = new Promise<IframeApi>((resolve) => {
    if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
      resolve(window.YT);

      return;
    } else {
      const protocol =
        window.location.protocol === "http:" ? "http:" : "https:";

      load(protocol + "//www.youtube.com/iframe_api", (error) => {
        if (error) {
          emitter.trigger("error", error);
        }
      });
    }

    const previous = window.onYouTubeIframeAPIReady;

    // The API will call this function when page has finished downloading
    // the JavaScript for the player API.
    window.onYouTubeIframeAPIReady = () => {
      if (previous) {
        previous();
      }

      resolve(window.YT);
    };
  });

  return iframeAPIReady;
};
