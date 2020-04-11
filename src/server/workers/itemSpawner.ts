import {
  readMapFiles,
  getTilesByType,
  SerializedObjectTile
} from "../utilities/mapFiles";
import ItemState from "serverState/item";
import { safeMapSchemaIndex } from "../utilities/colyseusState";
import { Room } from "colyseus";
import MapState from "serverState/map";

export default class ItemSpawner {
  room: Room<MapState>;
  timer: NodeJS.Timeout;
  mapItems: SerializedObjectTile<"item">[] = [];

  constructor(mapName: string, room: Room<MapState>) {
    const maps = readMapFiles();
    const mapData = maps[mapName];

    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
    this.mapItems = getTilesByType("item", mapData) || [];
  }

  tick() {
    this.mapItems.forEach((objectTile, index) => {
      const item = objectTile.properties;
      const safeIndex = safeMapSchemaIndex(index);
      const chance = Math.floor(Math.random() * item.chance);
      const quantity = item.maximumQuantity
        ? Math.floor(Math.random() * item.maximumQuantity)
        : item.quantity;
      if (chance === 1) {
        if (!this.room.state.items[safeIndex]) {
          this.room.state.items[safeIndex] = new ItemState(
            item.id,
            objectTile.tileId,
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
