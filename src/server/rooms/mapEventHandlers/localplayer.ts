import { RoomMessage } from "types/gameState";
import MapRoom from "../map";
import { Command } from "@colyseus/command";
import MapState from "@server/components/map";
import {
  addItemToPlayer,
  moveInventoryItem,
} from "@server/utilities/commandHandlers/inventory";

export class MovementReportCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:movement:report"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId];
    player.targetTile = data.targetTile;
  }
}

export class InventoryPickupCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:inventory:pickup"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId];
    const room = this.room as MapRoom;
    if (room.itemSpawner && player.targetTile) {
      const item = room.itemSpawner.getItem(player.targetTile, data.itemId);
      if (item) {
        addItemToPlayer(player.inventory, item);
      }
    }
  }
}

export class InventoryMoveCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:inventory:move"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId];
    moveInventoryItem(data.from, data.to, player.inventory);
  }
}

export class ShopTradeCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:shop:trade"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId];
    // TODO: Use the shop commandHelper to check and perform the trade.
  }
}
