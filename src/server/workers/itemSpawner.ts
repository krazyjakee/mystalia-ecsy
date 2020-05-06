import ItemState from "@server/components/item";
import { SerializedObjectTile, getTilesByType } from "utilities/tileMap";
import { mongoose } from "@colyseus/social";
import ItemSchema from "@server/db/ItemSchema";
import MapRoom from "@server/rooms/map";
import { randomHash } from "utilities/hash";
import { searchState } from "@server/utilities/colyseusState";
import { randomNumberBetween } from "utilities/math";

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

    this.loadFromDB();
  }

  loadFromDB() {
    const items = mongoose.model("Item", ItemSchema);
    items.find({ room: this.room.roomName }, (err, res) => {
      if (err) return console.log(err.message);
      res.forEach((doc) => {
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
    this.mapItems.forEach((objectTile) => {
      const item = objectTile.properties;
      const chance = randomNumberBetween(item.chance);
      const quantity = item.maximumQuantity
        ? randomNumberBetween(item.maximumQuantity)
        : item.quantity;
      if (chance === 1) {
        const isTileVacant =
          searchState(this.room.state.items, { tileId: objectTile.tileId })
            .length === 0;

        if (isTileVacant) {
          this.room.state.items[randomHash()] = new ItemState(
            item.id,
            objectTile.tileId,
            quantity
          );
        }
      }
    });
  }

  getItem(tileId: number, itemId?: number): ItemState | null {
    let foundItem: ItemState | null = null;
    searchState(this.room.state.items, { tileId }).forEach((key) => {
      const item = this.room.state.items[key] as ItemState;
      if (itemId === item.itemId || !itemId) {
        delete this.room.state.items[key];
        foundItem = item;
      }
    });
    return foundItem;
  }

  dispose() {
    clearInterval(this.timer);
  }
}
