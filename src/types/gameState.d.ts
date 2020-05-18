import User from "./User";
import InventoryState from "@server/components/inventory";
import { MapSchema } from "@colyseus/schema";
import { EnemyReference } from "./enemies";
import PlayerState from "@server/components/player";

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
  "localPlayer:change": {
    key: string;
    playerState: PlayerState;
  };
  "localPlayer:shop:open": {
    shopId: number;
  };
  "localPlayer:shop:trade": {
    shopId: number;
    tradeIndex: number;
  };
  "localPlayer:movement:report": {
    targetTile: number;
  };
  "localPlayer:movement:request": undefined;
  "localPlayer:movement:response": {
    currentTile: number;
  };
  "localPlayer:movement:walkOff": undefined;
  "localPlayer:movement:nextMap": {
    name: string;
    tile: number;
  };
  "localPlayer:inventory:pickup": {
    itemId?: number;
  };
  "localPlayer:inventory:response": MapSchema<InventoryState>;
  "localPlayer:inventory:move": {
    from: number;
    to: number;
  };
  "localPlayer:inventory:equip": {
    position: number;
  };
  "localPlayer:battle:targetEnemy": EnemyReference;
  "localPlayer:battle:unTarget": undefined;
  "enemy:battle:targetPlayer": {
    username: string;
  };
  "enemy:battle:damageTaken": {
    fromUsername: string;
    enemyKey: string;
    damage: number;
    itemId?: number;
    spellId?: number;
  };
  "enemy:battle:damageGiven": {
    toUsername: string;
    enemyKey: string;
    damage: number;
    spellId: number;
  };
  "localPlayer:quit": undefined;
  "remotePlayer:battle:damageTaken": {
    fromEnemyKey: string;
    playerUsername: string;
    damage: number;
    ability: number;
  };
  "localPlayer:battle:damageTaken": {
    fromEnemyKey: string;
    playerUsername: string;
    damage: number;
    ability: number;
  };
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
