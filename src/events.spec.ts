import { type Emitter } from "./events";
import { createEventEmitter } from "./events";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Emitter", () => {
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
