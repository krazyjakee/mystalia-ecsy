import { TMJ, Property } from "types/TMJ";
import { readMapFiles, getTilesByType, SerializedObject } from "./mapFiles";
import ItemState from "serverState/item";
import { MapSchema } from "@colyseus/schema";

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
      const chance = Math.floor(Math.random() * item.chance);
      const quantity = item.maximumQuantity
        ? Math.floor(Math.random() * item.maximumQuantity)
        : item.quantity;
      if (chance === 1) {
        if (
          (this.itemState[index] && !this.itemState[index].active) ||
          !this.itemState[index]
        ) {
          this.itemState[index] = new ItemState(item.id, item.tileId, quantity);
        }
      }
    });
  }

  getItem(tileId: number, itemId?: number) {
    const keys = Object.keys(this.itemState);
    for (let i = 0; i < keys.length; i += 1) {
      const item = this.itemState[keys[i]] as ItemState;
      if (item.tileId && item.tileId === tileId) {
        if ((itemId && itemId === item.itemId) || !itemId) {
          delete this.itemState[keys[i]];
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
