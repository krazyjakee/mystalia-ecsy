import { RoomMessageType } from "types/gameState";
import { ListAllMapsCommand, ListAllPlayersCommand } from "./list";
import { TeleportRequestCommand } from "./teleport";
import { ItemSpecUpdateCommand } from "./itemSpec";

export type AdminCommandsAvailable = Extract<
  RoomMessageType,
  | "admin:list:requestAllPlayers"
  | "admin:list:requestAllMaps"
  | "admin:teleport:request"
  | "admin:itemSpec:update"
>;

export const adminCommands: { [key in AdminCommandsAvailable]: any } = {
  "admin:list:requestAllPlayers": ListAllMapsCommand,
  "admin:list:requestAllMaps": ListAllPlayersCommand,
  "admin:teleport:request": TeleportRequestCommand,
  "admin:itemSpec:update": ItemSpecUpdateCommand,
};
