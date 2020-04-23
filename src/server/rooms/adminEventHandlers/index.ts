import { RoomMessageType } from "types/gameState";
import { ListAllMapsCommand, ListAllPlayersCommand } from "./list";
import { TeleportRequestCommand } from "./teleport";

export type AdminCommandsAvailable = Extract<
  RoomMessageType,
  | "admin:list:requestAllPlayers"
  | "admin:list:requestAllMaps"
  | "admin:teleport:request"
>;

export const adminCommands: { [key in AdminCommandsAvailable]: any } = {
  "admin:list:requestAllPlayers": ListAllMapsCommand,
  "admin:list:requestAllMaps": ListAllPlayersCommand,
  "admin:teleport:request": TeleportRequestCommand,
};
