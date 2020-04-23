import User from "./User";
import InventoryState from "@server/components/inventory";
import { MapSchema } from "@colyseus/schema";
import { EnemyReference } from "./enemies";

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
  "enemy:change": EnemyReference;
  "enemy:focused": EnemyReference;
  "enemy:unfocused": EnemyReference;
}

export type RoomMessageType = keyof GameStateEvents;

export type RoomMessage<T extends RoomMessageType> = GameStateEvents[T];

export type CommandBase<T> = {
  command: T;
};

export type PresenceMessage<T extends RoomMessageType> = CommandBase<T> &
  GameStateEvents[T];
