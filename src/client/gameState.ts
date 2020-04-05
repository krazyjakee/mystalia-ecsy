import {
  GameStateEventName,
  GameStateEvents,
  RoomMessage,
} from "types/gameState";
import { Room } from "colyseus.js";

type CallbacksContainer<T extends GameStateEventName> = {
  [key: string]: CallbackObject<T>[];
};

type CallbackFunction<T extends GameStateEventName> = (
  arg0: GameStateEvents[T]
) => void | false;

type CallbackObject<T extends GameStateEventName> = {
  callback: CallbackFunction<T>;
  hash: number;
};

type RoomTypes = "admin" | "map";

const makeHash = (input: string) => {
  var hash = 0,
    i,
    chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

class GameState {
  rooms: { [key: string]: Room } = {};

  callbacks: CallbacksContainer<any> = {};

  addRoom(type: RoomTypes, room: Room) {
    room.onMessage((data) => {
      this.trigger(data.command, data);
    });
    this.rooms[type] = room;
  }

  removeRoom(type: RoomTypes) {
    delete this.rooms[type];
  }

  send<T extends GameStateEventName>(
    type: RoomTypes = "map",
    name: T,
    data?: GameStateEvents[T]
  ) {
    if (this.rooms[type]) {
      const messageData = {
        command: name,
        ...data,
      };

      this.rooms[type].send(messageData);
      return true;
    }
    return false;
  }

  subscribe<T extends GameStateEventName>(
    eventName: T,
    callback: CallbackFunction<T>
  ) {
    const hash = makeHash(callback.toString());
    const callbackObject: CallbackObject<T> = {
      callback,
      hash,
    };

    this.callbacks[eventName]
      ? this.callbacks[eventName].push(callbackObject)
      : (this.callbacks[eventName] = [callbackObject]);
  }

  unsubscribe<T extends GameStateEventName>(
    eventName: T,
    callback: CallbackFunction<T>
  ) {
    if (this.callbacks[eventName]) {
      const hash = makeHash(callback.toString());
      const index = this.callbacks[eventName].findIndex(
        (cb) => cb.hash === hash
      );
      if (index > -1) {
        this.callbacks[eventName].splice(index, 1);
      }
    }
  }

  trigger<T extends GameStateEventName>(
    eventName: T,
    options?: GameStateEvents[T]
  ) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName].forEach((callbackObject) => {
        if (callbackObject.callback(options) === false) {
          this.unsubscribe(eventName, callbackObject.callback);
        }
      });
    }
  }
}

export default new GameState();
