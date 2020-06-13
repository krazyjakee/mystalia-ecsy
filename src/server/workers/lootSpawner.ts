import { SerializedObjectTile, getTilesByType } from "utilities/tileMap";
import { mongoose } from "@colyseus/social";
import MapRoom from "@server/rooms/map";
import { makeHash, randomHash } from "utilities/hash";
import LootSchema from "@server/db/LootSchema";
import LootState from "@server/components/loot";
import LootItemState from "@server/components/lootItem";
import { isPresent, clone } from "utilities/guards";
import { objectMap, objectFindValue, objectFilter } from "utilities/loops";
import { saveStateToDb } from "@server/utilities/dbState";
import { randomNumberBetween } from "utilities/math";
import { LootSpec } from "types/loot";
import { MapSchema } from "@colyseus/schema";
import lootItemStateToArray from "@client/react/Panels/Loot/lootItemStateToArray";

const lootSpecs = require("utilities/data/loot.json") as LootSpec[];

const config = require("@client/config.json");

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
        this.setCountdown(obj.tileId, obj.lootId, obj.countdown);
      });
      // @ts-ignore
      this.timer = setInterval(() => this.tick(), 1000);
    });
  }

  setCountdown(tileId: number, lootId: number, timeLeft?: number) {
    const uid = this.getUid(tileId);
    if (isPresent(timeLeft)) {
      this.lootCounters[uid] = timeLeft;
    } else {
      const spec = this.getSpec(lootId);
      if (spec) {
        this.lootCounters[uid] =
          spec.daysToRespawn * (config.dayLengthInMinutes * 1000); // TODO: Set back to 60000 when testing is done
      }
    }
  }

  tick() {
    const expiredLoot = this.mapLoot.filter((objectTile) => {
      const uid = this.getUid(objectTile.tileId);
      return !Boolean(
        objectFindValue(
          this.lootCounters,
          (key, value) => uid === key && value > 0
        )
      );
    });

    expiredLoot.forEach((objectTile) => {
      const lootProperty = objectTile.properties;
      if (!lootProperty || !isPresent(lootProperty.lootId)) return;

      const lootSpec = this.getSpec(lootProperty.lootId);
      if (!lootSpec) return;

      const uid = this.getUid(objectTile.tileId);

      if (!isPresent(this.lootCounters[uid])) {
        this.addLoot(lootSpec.id, objectTile.tileId, []);
        this.setCountdown(objectTile.tileId, lootSpec.id, 0);
      } else {
        this.replenishLoot(lootSpec.id, objectTile.tileId);
      }
    });

    Object.keys(this.lootCounters).forEach(
      (key) => (this.lootCounters[key] -= 1000)
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
    const spec = this.getSpec(lootId);
    if (lootState && spec) {
      const items = lootItemStateToArray(this.room.state.loot[uid].items);

      const existingItems = items.map((item) => item.itemId);
      const existingPositions = items.map((item) => item.position);

      const availablePositions: number[] = [];
      for (let i = 0; i < 6; i += 1) {
        if (!existingPositions.includes(i)) {
          availablePositions.push(i);
        }
      }

      const replenishedItems = spec.items
        .filter((item) => !existingItems.includes(item.itemId))
        .map((item) => {
          const roll = randomNumberBetween(item.chance);
          if (roll === 1) {
            const quantity = randomNumberBetween(
              item.quantity[1],
              item.quantity[0]
            );
            const position = availablePositions.shift() || 0;
            if (quantity && isPresent(position)) {
              return new LootItemState({
                itemId: item.itemId,
                position,
                quantity,
              });
            }
          }
        })
        .filter(isPresent)
        .map((item) => {
          this.room.state.loot[uid].items[randomHash()] = item;
          return 1;
        });

      if (replenishedItems.length) {
        console.log(
          `Loot on ${this.room.roomName} at tile ${tileId} has been replenished.`
        );
      }

      this.setCountdown(tileId, lootId);
    }
  }

  addLoot(lootId: number, tileId: number, items: LootItemState[] = []) {
    const uid = this.getUid(tileId);
    this.room.state.loot[uid] = new LootState(lootId, tileId, items);
  }

  grabbedItem(tileId: number, position: number) {
    const uid = this.getUid(tileId);
    if (this.room.state.loot[uid]) {
      const item = objectFindValue(
        this.room.state.loot[uid].items,
        (_, item) => item.position === position
      );
      return item as LootItemState;
    }
  }

  removeItem(tileId, position) {
    const uid = this.getUid(tileId);
    const item = objectFilter(
      this.room.state.loot[uid].items,
      (_, item) => item.position === position
    );
    delete this.room.state.loot[uid].items[Object.keys(item)[0]];
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
