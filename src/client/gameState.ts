import {
  GameStateEventName,
  GameStateEvents,
  RoomSendMessage
} from "types/gameState";
import { Room } from "colyseus.js";

type CallbacksContainer = { [key in GameStateEventName]: CallbackObject[] };
type CallbackObject = {
  callback: Function;
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

  callbacks: CallbacksContainer = {
    "admin:enable": [],
    "admin:disable": [],
    "admin:list:allPlayers": []
  };

  addRoom(type: RoomTypes, room: Room) {
    room.onMessage(data => {
      this.trigger(data.command, data);
    });
    this.rooms[type] = room;
  }

  removeRoom(type: RoomTypes) {
    delete this.rooms[type];
  }

  sendRoom<T extends GameStateEventName>(
    type: RoomTypes = "map",
    name: T
    // data?: GameStateEvents[T]
  ) {
    if (this.rooms[type]) {
      const messageData: RoomSendMessage<T> = {
        command: name
        // data: data ? data : undefined
      };

      this.rooms[type].send(messageData);
      return true;
    }
    return false;
  }

  subscribe<T extends GameStateEventName>(
    eventName: T,
    callback: (arg0: GameStateEvents[T]) => void
  ) {
    const hash = makeHash(callback.toString());
    this.callbacks[eventName].push({
      callback,
      hash
    });
  }

  unsubscribe<T extends GameStateEventName>(
    eventName: T,
    callback: (arg0: GameStateEvents[T]) => void
  ) {
    const hash = makeHash(callback.toString());
    const index = this.callbacks[eventName].findIndex(cb => cb.hash === hash);
    if (index > -1) {
      this.callbacks[eventName].splice(index, 1);
    }
  }

  trigger<T extends GameStateEventName>(
    eventName: T,
    options?: GameStateEvents[T]
  ) {
    this.callbacks[eventName].forEach(callbackObject =>
      callbackObject.callback(options)
    );
  }
}

export default new GameState();
