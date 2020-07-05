function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export class Receiver<T, S = undefined, U extends string = string> {
  #respond?: (line: string, value: S) => void;
  #disconnect?: () => void;
  #value?: () => T;

  public respond(line: U, value: S) {
    if (this.#respond) {
      this.#respond(line, value);
    }
  }

  public disconnect() {
    if (this.#disconnect) {
      this.#disconnect();
    }
    
    this.#respond = undefined;
    this.#disconnect = undefined;
    this.#value = undefined;
  }

  public get value() {
    if (this.#value) {
      return this.#value();
    }
  }

  constructor(
    respond: (line: string, value: S) => void,
    disconnect: () => void,
    value: () => T) {
    this.#respond = respond;
    this.#disconnect = disconnect;
    this.#value = value;
  }
}

export class Bridge<T, U extends string = string> {
  private static readonly channels: Partial<Record<string, Bridge<unknown>>> = {};

  public static open<T, U extends string = string>(value: T) {
    const bridge = new Bridge<T, U>(value);

    Bridge.channels[bridge.channelId] = bridge;

    return bridge;
  }

  public static connect<T, S = undefined, U extends string = string>(channelId: string, listener?: (value: T) => void) {
    const bridge = Bridge.channels[channelId] as Bridge<T, U> | undefined;

    if (bridge) {
      if (listener) {
        bridge.#listeners.push(listener);
      }

      const receiver = new Receiver<T, S, U>((line: U, value: S) => {
        const operator = bridge.#operators[line];
  
        if (operator) {
          operator(value);
        }
      }, () => {
        if (listener) {
          const listenerIndex = bridge.#listeners.indexOf(listener);
          
          if (listenerIndex > -1) {
            bridge.#listeners.splice(listenerIndex, 1);
          }
        }

        const receiverIndex = bridge.#receivers.indexOf(receiver);

        if (receiverIndex > -1) {
          bridge.#receivers.splice(receiverIndex, 1);
        }
      }, () => {
        return bridge.value;
      });

      bridge.#receivers.push(receiver);

      return receiver;
    }
  }

  #value: T;

  private constructor(value: T) {
    this.#value = value;
  }

  readonly #channelId: string = (() => {
    let channelId = uuid();

    while (Bridge.channels[channelId] !== undefined) {
      channelId = uuid();
    }
    
    return channelId;
  })();

  readonly #listeners: ((value: T) => void)[] = [];
  readonly #operators: Partial<Record<U, (value: unknown) => void>> = {};
  readonly #receivers: Receiver<T, unknown, U>[] = [];

  public route<S>(line: U, operator: (value: S) => void) {
    this.#operators[line] = operator;
  }

  public broadcast(value: T) {
    this.#value = value;

    for (let i = 0; i < this.#listeners.length; ++i) {
      this.#listeners[i](this.#value);
    }
  }

  public get value() {
    return this.#value;
  }

  public get channelId() {
    return this.#channelId;
  }

  public close() {
    while (this.#listeners.length) {
      this.#listeners.pop();
    }

    while (this.#receivers.length) {
      const receiver = this.#receivers.pop();

      if (receiver) {
        receiver.disconnect();
      }
    }

    const lines = Object.keys(this.#operators) as U[];

    while (lines.length) {
      const line = lines.pop();

      if (line && this.#operators[line]) {
        this.#operators[line] = undefined;
      }
    }

    Bridge.channels[this.#channelId] = undefined;
  }
}