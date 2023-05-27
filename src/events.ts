export type Handler = (...args: unknown[]) => unknown;
export type HandlerMap = Record<string, Handler>;

/**
 * Minimal event emitter
 */
export type Emitter<EventMap extends HandlerMap = HandlerMap> = {
  /**
   * Remove an event handler
   *
   * @param event name of the event
   * @param handler function executed when event occurs
   */
  off: <Event extends keyof EventMap>(
    event: Event,
    handler: EventMap[Event]
  ) => void;

  /**
   * Listen for an event and execute handler when it occurs
   *
   * @param event name of the event
   * @param handler function executed when event occurs
   */
  on: <Event extends keyof EventMap>(
    event: Event,
    handler: EventMap[Event]
  ) => void;

  /**
   * Trigger an event, executing attached handlers
   *
   * @param event name of the event to listen
   * @param args passed to each handler registered for the event
   */
  trigger: <Event extends keyof EventMap>(
    event: Event,
    ...args: Parameters<EventMap[Event]>
  ) => void;
};

/**
 * Map keys to stacks (arrays) of the corresponding input type
 */
type StackMap<T> = { [K in keyof T]?: Array<T[K]> };

export const createEventEmitter = <
  Events extends HandlerMap = HandlerMap
>(): Emitter<Events> => {
  const eventHandlers: StackMap<Events> = {};

  return {
    on: (event, handler) => {
      const handlers = eventHandlers[event] ?? [];

      handlers.push(handler);

      eventHandlers[event] = handlers;
    },

    off: (event, handler) => {
      const handlers = eventHandlers[event];

      if (!handlers) {
        return;
      }

      const index = handlers.indexOf(handler);

      if (index !== -1) {
        handlers.splice(index, 1);

        eventHandlers[event] = handlers;
      }
    },

    trigger: (name, ...args) => {
      const handlers = eventHandlers[name] ?? [];

      for (const handler of handlers) {
        handler(...args);
      }
    },
  };
};
