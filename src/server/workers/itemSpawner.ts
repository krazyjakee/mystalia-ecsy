import ItemState from "serverState/item";
import { safeMapSchemaIndex } from "../utilities/colyseusState";
import { SerializedObjectTile, getTilesByType } from "utilities/tileMap";
import { mongoose } from "@colyseus/social";
import ItemSchema from "../db/ItemSchema";
import MapRoom from "../rooms/map";

export default class ItemSpawner {
  room: MapRoom;
  timer: NodeJS.Timeout;
  mapItems: SerializedObjectTile<"item">[] = [];

  constructor(room: MapRoom) {
    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
    if (this.room.mapData) {
      this.mapItems = getTilesByType("item", this.room.mapData) || [];
    }
  }

  loadFromDB() {
    const items = mongoose.model("Item", ItemSchema);
    items.find({ room: this.room.roomName }, (err, res) => {
      if (err) return console.log(err.message);
      res.forEach(doc => {
        const obj = doc.toJSON();
        this.room.state.items[obj.index] = new ItemState(
          obj.itemId,
          obj.tileId,
          obj.quantity
        );
      });
    });
  }

  tick() {
    this.mapItems.forEach((objectTile, index) => {
      const item = objectTile.properties;
      const safeIndex = safeMapSchemaIndex(index);
      const chance = Math.floor(Math.random() * item.chance);
      const quantity = item.maximumQuantity
        ? Math.floor(Math.random() * item.maximumQuantity) + 1
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
