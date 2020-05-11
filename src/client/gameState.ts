import { GameStateEvents, RoomMessageType } from "types/gameState";
import { Room } from "colyseus.js";
import { makeHash } from "utilities/hash";

type CallbacksContainer<T extends RoomMessageType> = {
  [key: string]: CallbackObject<T>[];
};

type CallbackFunction<T extends RoomMessageType> = (
  arg0: GameStateEvents[T]
) => void | false;

type CallbackObject<T extends RoomMessageType> = {
  callback: CallbackFunction<T>;
  hash: string;
};

type RoomTypes = "admin" | "map";

class GameState {
  rooms: { [key: string]: Room } = {};

  callbacks: CallbacksContainer<any> = {};

  addRoom(type: RoomTypes, room: Room) {
    room.onMessage("*", (command, data) => {
      this.trigger(command as RoomMessageType, data);
    });
    this.rooms[type] = room;
  }

  removeRoom(type: RoomTypes) {
    delete this.rooms[type];
  }

  send<T extends RoomMessageType>(
    type: RoomTypes = "map",
    name: T,
    data?: GameStateEvents[T]
  ) {
    if (this.rooms[type]) {
      const messageData = {
        ...data,
      };

      this.rooms[type].send(name, messageData);
      return true;
    }
    return false;
  }

  subscribe<T extends RoomMessageType>(
    eventName: T,
    callback: CallbackFunction<T>,
    key = ""
  ) {
    const hash = makeHash(key + callback.toString());
    const callbackObject: CallbackObject<T> = {
      callback,
      hash,
    };

    this.callbacks[eventName]
      ? this.callbacks[eventName].push(callbackObject)
      : (this.callbacks[eventName] = [callbackObject]);
  }

  unsubscribe<T extends RoomMessageType>(
    eventName: T,
    callback?: CallbackFunction<T>,
    key = ""
  ) {
    if (this.callbacks[eventName] && callback) {
      const hash = makeHash(callback.toString());
      const index = this.callbacks[eventName].findIndex(
        (cb) => cb.hash === hash
      );
      if (index > -1) {
        this.callbacks[eventName].splice(index, 1);
      }
    } else {
      delete this.callbacks[eventName];
    }
  }

  trigger<T extends RoomMessageType>(
    eventName: T,
    options: GameStateEvents[T]
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
