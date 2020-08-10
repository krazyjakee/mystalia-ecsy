import { RoomMessage } from "types/gameState";
import MapRoom from "../map";
import { Command } from "@colyseus/command";
import MapState from "@server/components/map";
import {
  addItemToPlayer,
  moveInventoryItem,
  equipItem,
} from "@server/utilities/commandHandlers/inventory";
import { performTrade } from "@server/utilities/commandHandlers/shop";
import { ShopSpec } from "types/shops";
import PlayerState from "@server/components/player";
import { movementWalkOff } from "@server/utilities/commandHandlers/map";
import ItemState from "@server/components/item";
import { performCraft } from "@server/utilities/commandHandlers/craft";
import { CraftableSpec } from "types/craftable";

const shops = require("utilities/data/shop.json") as ShopSpec[];
const craftables = require("utilities/data/craftables.json") as CraftableSpec[];

export class MovementReportCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:movement:report"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId];
    if (!player) return;
    player.targetTile = data.targetTile;
  }
}

export class MovementWalkOffCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:movement:walkOff"> }
> {
  execute({ sessionId, data }) {
    const getNextMapPosition = () => {
      const player = this.state.players[sessionId];
      if (!player) return;

      const mapRoom = this.room as MapRoom;
      const nextMapPosition = movementWalkOff(
        player,
        this.room.roomName,
        data.direction,
        mapRoom.objectTileStore
      );

      const client = this.room.clients.find((c) => c.sessionId === sessionId);
      if (!client) return false;
      if (nextMapPosition) {
        const response: RoomMessage<"localPlayer:movement:nextMap"> = {
          fileName: nextMapPosition.fileName,
          tileId: nextMapPosition.tileId,
        };
        client.send("localPlayer:movement:nextMap", response);
        return true;
      } else {
        client.send("localPlayer:movement:nextMap", undefined);
        return false;
      }
    };

    const nextPositionFound = getNextMapPosition();
    if (!nextPositionFound) {
      setTimeout(() => getNextMapPosition(), 1000);
    }
  }
}

export class InventoryPickupCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:inventory:pickup"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
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
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
    moveInventoryItem(data.from, data.to, player.inventory);
  }
}

export class InventoryEquipCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:inventory:equip"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
    equipItem(player.inventory, data.position);
  }
}

export class CraftCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:craft:request"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
    const craftable = craftables.find((c) => c.id === data.craftableId);
    if (craftable && player.inventory) {
      performCraft(player.inventory, craftable);
    }
  }
}

export class ShopTradeCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:shop:trade"> }
> {
  execute({ sessionId, data }) {
    const shopId = data.shopId;
    const shopSpec = shops.find((s) => s.id === shopId);
    if (shopSpec) {
      const trade = shopSpec.trades[data.tradeIndex];
      performTrade(this.state.players[sessionId].inventory, trade);
    }
  }
}

export class BattleTargetEnemyCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:battle:targetEnemy"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
    player.targetEnemy = data.key;
  }
}

export class BattleUnTargetCommand extends Command<
  MapState,
  { sessionId: string }
> {
  execute({ sessionId }) {
    const player = this.state.players[sessionId] as PlayerState;
    if (!player) return;
    player.targetEnemy = undefined;
  }
}

export class LootGrabCommand extends Command<
  MapState,
  { sessionId: string; data: RoomMessage<"localPlayer:loot:grab"> }
> {
  execute({ sessionId, data }) {
    const player = this.state.players[sessionId] as PlayerState;
    const room = this.room as MapRoom;
    if (!room.lootSpawner) return;

    const item = room.lootSpawner.grabbedItem(data.tileId, data.position);
    if (item) {
      const itemState = new ItemState(item.itemId, -1, item.quantity);
      if (addItemToPlayer(player.inventory, itemState)) {
        room.lootSpawner.removeItem(data.tileId, data.position);
      }
    }
  }
}
