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
  LootGrabCommand,
  CraftCommand,
} from "./localplayer";
import { ChatPublishCommand, GlobalChatPublishCommand } from "./chat";

export type RoomCommandsAvailable = Extract<
  RoomMessageType,
  | "localPlayer:movement:report"
  | "localPlayer:movement:walkOff"
  | "localPlayer:inventory:pickup"
  | "localPlayer:inventory:move"
  | "localPlayer:inventory:equip"
  | "localPlayer:craft:request"
  | "localPlayer:shop:trade"
  | "localPlayer:battle:targetEnemy"
  | "localPlayer:battle:unTarget"
  | "localPlayer:loot:grab"
  | "chat:publish:global"
>;

export const roomCommands: { [key in RoomCommandsAvailable]: any } = {
  "localPlayer:movement:report": MovementReportCommand,
  "localPlayer:movement:walkOff": MovementWalkOffCommand,
  "localPlayer:inventory:pickup": InventoryPickupCommand,
  "localPlayer:inventory:move": InventoryMoveCommand,
  "localPlayer:inventory:equip": InventoryEquipCommand,
  "localPlayer:craft:request": CraftCommand,
  "localPlayer:shop:trade": ShopTradeCommand,
  "localPlayer:battle:targetEnemy": BattleTargetEnemyCommand,
  "localPlayer:battle:unTarget": BattleUnTargetCommand,
  "localPlayer:loot:grab": LootGrabCommand,
  "chat:publish:global": GlobalChatPublishCommand,
};

export const thisRoomCommands = (roomName: string) => {
  const results = {};
  results[`chat:publish:${roomName}`] = ChatPublishCommand;
  return results;
};
