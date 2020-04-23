import { RoomMessageType } from "types/gameState";
import {
  MovementReportCommand,
  InventoryPickupCommand,
  InventoryMoveCommand,
} from "./localplayer";

export type RoomCommandsAvailable = Extract<
  RoomMessageType,
  | "localPlayer:movement:report"
  | "localPlayer:inventory:pickup"
  | "localPlayer:inventory:move"
>;

export const roomCommands: { [key in RoomCommandsAvailable]: any } = {
  "localPlayer:movement:report": MovementReportCommand,
  "localPlayer:inventory:pickup": InventoryPickupCommand,
  "localPlayer:inventory:move": InventoryMoveCommand,
};
