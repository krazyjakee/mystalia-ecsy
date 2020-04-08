import { readMapFiles, getTilesByType, SerializedObject } from "./mapFiles";
import ItemState from "serverState/item";
import { MapSchema } from "@colyseus/schema";
import { safeMapSchemaIndex } from "./colyseusState";
import { Room } from "colyseus";
import MapState from "serverState/map";

export default class ItemSpawner {
  room: Room<MapState>;
  timer: NodeJS.Timeout;
  mapItems: SerializedObject<"item">[] = [];

  constructor(mapName: string, room: Room<MapState>) {
    const maps = readMapFiles();
    const mapData = maps[mapName];

    this.room = room;

    this.timer = setInterval(() => this.tick(), 1000) as NodeJS.Timeout;
    this.mapItems = getTilesByType("item", mapData) || [];
  }

  tick() {
    this.mapItems.forEach((item, index) => {
      const safeIndex = safeMapSchemaIndex(index);
      const chance = Math.floor(Math.random() * item.chance);
      const quantity = item.maximumQuantity
        ? Math.floor(Math.random() * item.maximumQuantity)
        : item.quantity;
      if (chance === 1) {
        if (!this.room.state.items[safeIndex]) {
          this.room.state.items[safeIndex] = new ItemState(
            item.id,
            item.tileId,
            quantity
          );
        }
      }
    });
  }

  getItem(tileId: number, itemId?: number) {
    for (let key in this.room.state.items) {
      const item = this.room.state.items[key] as ItemState;
      if (item && item.tileId && item.tileId === tileId) {
        if ((itemId && itemId === item.itemId) || !itemId) {
          delete this.room.state.items[key];
          return item;
        }
      }
    }
    return null;
  }

  dispose() {
    clearInterval(this.timer);
  }
}
