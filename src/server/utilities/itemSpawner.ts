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
          this.itemState[index] = new ItemState(
            item.itemId,
            item.tileId,
            quantity
          );
        }
      }
    });
  }

  dispose() {
    clearInterval(this.timer);
  }
}
