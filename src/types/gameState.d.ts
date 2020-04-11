import User from "./User";
import InventoryState from "serverState/inventory";
import { MapSchema } from "@colyseus/schema";

export interface GameStateEvents {
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
    map?: string;
    tileId?: number;
  };
  "admin:teleport:response": {
    map: string;
    tileId: number;
  };
  "localPlayer:movement:report": {
    targetTile: number;
  };
  "localPlayer:movement:request": undefined;
  "localPlayer:movement:response": {
    currentTile: number;
  };
  "localPlayer:inventory:pickup": {
    itemId?: number;
  };
  "localPlayer:inventory:response": MapSchema<InventoryState>;
  "localPlayer:inventory:move": {
    from: number;
    to: number;
  };
  "localPlayer:quit": undefined;
}

export type GameStateEventName = keyof GameStateEvents;

type CommandBase<T> = {
  command: T;
};

export type RoomMessage<T extends GameStateEventName> = CommandBase<T> &
  GameStateEvents[T];
