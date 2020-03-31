import User from "./User";

export type GameStateEvents = {
  "admin:list:allPlayers": {
    all: Pick<User, "username" | "displayName">[];
  };
  "admin:enable": undefined;
  "admin:disable": undefined;
};

export type GameStateEventName = keyof GameStateEvents;

export type RoomReceivedMessage<T extends GameStateEventName> = {
  command: T;
} & GameStateEvents[T];

export type RoomSendMessage<T extends GameStateEventName> = {
  command: T;
};
