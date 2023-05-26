import { expect, describe, beforeEach, it, vi } from "vitest";
import { createEventEmitter, Emitter } from "./events";

describe("Emitter", function () {
  let eventEmitter: Emitter;

  beforeEach(() => {
    eventEmitter = createEventEmitter();
  });

  it("should not invoke handlers that were removed", () => {
    const handler = vi.fn();

    eventEmitter.on("foo", handler);

    eventEmitter.trigger("foo");

    eventEmitter.off("foo", handler);

    eventEmitter.trigger("foo");

    expect(handler).toHaveBeenCalledOnce();
  });

  it("should invoke every handler for event in order", () => {
    let result = "";

    eventEmitter.on("foo", () => {
      result += "a";
    });
    eventEmitter.on("foo", () => {
      result += "b";
    });
    eventEmitter.on("foo", () => {
      result += "c";
    });
    eventEmitter.on("foo", () => {
      result += "d";
    });

    eventEmitter.trigger("foo");

    expect(result).to.deep.equal("abcd");
  });

  it("passes data parameter to each handler", () => {
    const mockData = {};

    const handler = vi.fn();

    eventEmitter.on("foo", handler);
    eventEmitter.trigger("foo", mockData);

    expect(handler).toHaveBeenCalledWith(mockData);
  });
});
