import { SerializedObjectTile, getTilesByType } from "utilities/tileMap";
import { mongoose } from "@colyseus/social";
import MapRoom from "@server/rooms/map";
import { makeHash } from "utilities/hash";
import LootSchema from "@server/db/LootSchema";
import LootState from "@server/components/loot";
import LootItemState from "@server/components/lootItem";
import { isPresent } from "utilities/guards";
import { objectForEach, objectMap, objectFilter } from "utilities/loops";
import { saveStateToDb } from "@server/utilities/dbState";

const lootSpecs = require("utilities/data/loot.json") as LootSpec[];

export default class LootSpawner {
  room: MapRoom;
  timer?: NodeJS.Timeout;
  mapLoot: SerializedObjectTile<"loot">[] = [];
  lootCounters: { [key: string]: number } = {};

  constructor(room: MapRoom) {
    this.room = room;

    if (this.room.mapData) {
      this.mapLoot = getTilesByType("loot", this.room.mapData) || [];
    }

    this.loadFromDB();
  }

  loadFromDB() {
    const loots = mongoose.model("Loot", LootSchema);
    loots.find({ room: this.room.roomName }, (err, res) => {
      if (err) return console.log(err.message);
      res.forEach((doc) => {
        const obj = doc.toJSON();
        const items = obj.items.map((item) => new LootItemState(item));
        this.addLoot(obj.lootId, obj.tileId, items);
        // TODO: Set the lootCountdown stored in the DB
      });
      // @ts-ignore
      this.timer = setInterval(() => this.tick(), 1000);
    });
  }

  tick() {
    const expiredLoot = this.mapLoot.filter((objectTile) => {
      if (
        Object.keys(this.lootCounters).find(
          (key) =>
            this.getUid(objectTile.tileId) === key && this.lootCounters[key] > 0
        )
      ) {
        return false;
      }
      return true;
    });

    expiredLoot.forEach((objectTile) => {
      const lootProperty = objectTile.properties;
      if (!lootProperty || !isPresent(lootProperty.lootId)) return;

      const lootSpec = this.getSpec(lootProperty.lootId);
      if (!lootSpec) return;

      const uid = this.getUid(objectTile.tileId);

      if (!this.lootCounters[uid]) {
        this.addLoot(lootSpec.id, objectTile.tileId, []);
      } else {
        this.replenishLoot(lootSpec.id, objectTile.tileId);
      }
    });

    Object.keys(this.lootCounters).forEach(
      (key) => (this.lootCounters[key] -= 1)
    );
  }

  getUid(tileId) {
    return makeHash(`${tileId}_${this.room.roomName}`);
  }

  getSpec(lootId) {
    return lootSpecs.find((spec) => spec.id === lootId);
  }

  replenishLoot(lootId: number, tileId: number) {
    const uid = this.getUid(tileId);

    const lootState = this.room.state.loot[uid] as LootState;
    if (lootState) {
      const spec = this.getSpec(lootId);
      const existingItems = Object.values(
        objectMap(lootState.items, (_, value: LootItemState) => value.itemId)
      );
      // TODO: For items that don't exist, replenish them
      // TODO: Reset lootCounter
    }
  }

  addLoot(lootId: number, tileId: number, items: LootItemState[]) {
    const uid = this.getUid(tileId);
    this.room.state.loot[uid] = new LootState(lootId, tileId, []);
  }

  async dispose() {
    if (this.timer) clearInterval(this.timer);

    await saveStateToDb(
      "Loot",
      this.room.roomName,
      this.room.state.loot,
      (lootState: LootState) => {
        const countdown = this.lootCounters[this.getUid(lootState.tileId)] || 0;
        const items = objectMap(
          lootState.items,
          (_, { itemId, position, quantity }: LootItemState) => ({
            itemId,
            position,
            quantity,
          })
        );

        return {
          items,
          ...{ countdown },
        };
      }
    );
  }
}
