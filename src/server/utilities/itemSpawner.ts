import { readMapFiles, getTilesByType, SerializedObject } from "./mapFiles";
import ItemState from "serverState/item";
import { MapSchema } from "@colyseus/schema";
import { safeMapSchemaIndex } from "./colyseusState";

export default class ItemSpawner {
  itemState: MapSchema<ItemState>;
  timer: NodeJS.Timeout;
  mapItems: SerializedObject<"item">[] = [];

  constructor(mapName: string, itemState: MapSchema<ItemState>) {
    const maps = readMapFiles();
    const mapData = maps[mapName];

    this.itemState = itemState;
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
        if (!this.itemState[safeIndex]) {
          this.itemState[safeIndex] = new ItemState(
            item.id,
            item.tileId,
            quantity
          );
        }
      }
    });
  }

  getItem(tileId: number, itemId?: number) {
    const keys = Object.keys(this.itemState);
    for (let i = 0; i < keys.length; i += 1) {
      const safeIndex = keys[i];
      const item = this.itemState[safeIndex] as ItemState;
      if (item && item.tileId && item.tileId === tileId) {
        if ((itemId && itemId === item.itemId) || !itemId) {
          delete this.itemState[safeIndex];
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
