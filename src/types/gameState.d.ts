import User from "./User";

export type GameStateEvents = {
  "admin:list:allPlayers": {
    all: Pick<User, "username" | "displayName">[];
  };
  "admin:list:requestAllPlayers": undefined;
  "admin:enable": undefined;
  "admin:disable": undefined;
  "admin:list:requestAllMaps": undefined;
  "admin:list:allMaps": {
    all: string[];
  };
  "admin:teleport:request": {
    username: string;
    map: string;
    tileId: number;
  };
  "admin:teleport:response": {
    map: string;
    tileId: number;
  };
};

export type GameStateEventName = keyof GameStateEvents;

export type RoomMessage<T extends GameStateEventName> = {
  command: T;
};
