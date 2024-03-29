import User from "./User";
import InventoryState from "@server/components/inventory";
import { MapSchema } from "@colyseus/schema";
import { EnemyReference } from "./enemies";
import PlayerState from "@server/components/player";
import { Direction } from "./Grid";
import { ItemSpec } from "./TileMap/ItemTiles";
import LootState from "@server/components/loot";

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
    fileName?: string;
    tileId?: number;
  };
  "admin:timeSpec:update": {
    dayLengthMins: number | undefined;
  };
  "admin:timePhase:update": {
    dayLengthPerc: number | undefined;
    transitionPerc: number | undefined;
  };
  "admin:forceTime:update": {
    hours: number | undefined;
    minutes: number | undefined;
    active: boolean;
  };
  "admin:globalLightSpec:update": {
    radius: number | undefined;
    intensity: number | undefined;
  };
  "admin:itemSpec:update": {
    specs: ItemSpec[];
  };
  "admin:itemSpec:updated": {
    result: boolean;
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
  "localPlayer:movement:walkOff": {
    direction?: Direction;
  };
  "localPlayer:movement:nextMap": {
    fileName: string;
    tileId: number;
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
  "localPlayer:loot:open": {
    tileId: number;
  };
  "localPlayer:loot:request": {
    tileId: number;
  };
  "localPlayer:loot:update": {
    tileId: number;
    lootState: LootState;
  };
  "localPlayer:loot:grab": {
    tileId: number;
    position: number;
  };
  "localPlayer:battle:targetEnemy": EnemyReference;
  "localPlayer:battle:unTarget": undefined;
  "localPlayer:craft:request": {
    craftableId: number;
  };
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
  "localPlayer:currentMap:request": undefined;
  "localPlayer:currentMap:response": {
    mapName: string;
  };
  "enemy:change": EnemyReference;
  "enemy:focused": EnemyReference;
  "enemy:unfocused": EnemyReference;
  "chat:subscribe": {
    message: string;
    username: string;
    role: string;
    date: number;
  };
  "chat:publish:global": {
    message: string;
  };
  "chat:publish": {
    message: string;
  };
  "setting:musicVolume": string;
  "setting:sfxVolume": string;
}

export type RoomMessageType = keyof GameStateEvents;

export type RoomMessage<T extends RoomMessageType> = GameStateEvents[T];

export type CommandBase<T> = {
  command: T;
};

export type PresenceMessage<T extends RoomMessageType> = CommandBase<T> &
  GameStateEvents[T];
