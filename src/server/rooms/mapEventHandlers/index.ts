import { RoomMessageType } from "types/gameState";
import {
  MovementReportCommand,
  InventoryPickupCommand,
  InventoryMoveCommand,
  ShopTradeCommand,
  InventoryEquipCommand,
  BattleTargetEnemyCommand,
  BattleUnTargetCommand,
  MovementWalkOffCommand,
} from "./localplayer";

export type RoomCommandsAvailable = Extract<
  RoomMessageType,
  | "localPlayer:movement:report"
  | "localPlayer:movement:walkOff"
  | "localPlayer:inventory:pickup"
  | "localPlayer:inventory:move"
  | "localPlayer:inventory:equip"
  | "localPlayer:shop:trade"
  | "localPlayer:battle:targetEnemy"
  | "localPlayer:battle:unTarget"
>;

export const roomCommands: { [key in RoomCommandsAvailable]: any } = {
  "localPlayer:movement:report": MovementReportCommand,
  "localPlayer:movement:walkOff": MovementWalkOffCommand,
  "localPlayer:inventory:pickup": InventoryPickupCommand,
  "localPlayer:inventory:move": InventoryMoveCommand,
  "localPlayer:inventory:equip": InventoryEquipCommand,
  "localPlayer:shop:trade": ShopTradeCommand,
  "localPlayer:battle:targetEnemy": BattleTargetEnemyCommand,
  "localPlayer:battle:unTarget": BattleUnTargetCommand,
};
