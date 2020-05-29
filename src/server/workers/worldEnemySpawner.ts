import { WorldEnemy, WorldEnemyProps } from "./enemies/worldEnemy";
import { mongoose } from "@colyseus/social";
import EnemySchema from "@server/db/EnemySchema";
import { EnemySpec } from "types/enemies";
import { readMapFiles } from "@server/utilities/mapFiles";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { ObjectTileAndTileId } from "utilities/tileMap";
import { makeHash } from "utilities/hash";
import { matchMaker } from "colyseus";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class WorldEnemySpawner {
  master: boolean = false;
  enemies: WorldEnemy[] = [];

  constructor() {
    this.checkForMaster();
  }

  async checkForMaster() {
    const worldEnemySpawnerMasterExists = await matchMaker.presence.hget(
      `worldEnemySpawner:master`,
      "i"
    );
    if (!worldEnemySpawnerMasterExists) {
      this.master = true;
      matchMaker.presence.hset(`worldEnemySpawner:master`, "i", "i");
    }
  }

  loadFromDB() {
    const enemies = mongoose.model("Enemy", EnemySchema);
    enemies.find({ traveler: true }, (err, res) => {
      if (err) return console.log(err.message);
      res.forEach((doc) => {
        const obj = doc.toJSON();
        const spec = enemySpecs.find((spec) => spec.id === obj.enemyId);
        const objectTile = this.getObjectTile({
          roomName: obj.room,
          stateId: obj.index,
        });
        if (spec && objectTile) {
          this.enemies.push(
            new WorldEnemy({
              uid: objectTile.uid,
              spec,
              objectTile,
              currentTile: obj.currentTile,
              roomName: obj.room,
              tilePath: obj.tilePath,
              damage: obj.damage,
            })
          );
        }
      });
    });
  }

  getObjectTile({
    roomName,
    stateId,
  }: {
    roomName: string;
    stateId: string;
  }): (ObjectTileAndTileId<"enemy"> & { uid: string }) | undefined {
    const maps = readMapFiles();
    const map = maps[roomName];
    const ots = new ObjectTileStore(map);
    const enemyObjects = ots.getAllByType("enemy");
    const objectTile = enemyObjects.find(
      (enemyObject) =>
        makeHash(`${enemyObject.objectTile.value.id}_${enemyObject.tileId}`) ===
        stateId
    );
    if (objectTile) {
      const uid = `${objectTile.objectTile.value.id}_${objectTile.tileId}`;
      return {
        ...objectTile,
        uid,
      };
    }
  }

  addEnemy(enemyProps: WorldEnemyProps) {
    if (!this.exists(enemyProps.uid)) {
      this.enemies.push(new WorldEnemy(enemyProps));
    }
  }

  mount(stateId: string) {
    const index = this.enemies.findIndex((enemy) => enemy.uid === stateId);
    if (index > -1) {
      this.enemies[index].mapTick = true;
    }
  }

  exists(stateId: string) {
    return this.enemies.findIndex((enemy) => enemy.uid === stateId) > -1;
  }

  requestByRoom(roomName: string) {
    const enemies = this.enemies.filter(
      (enemy) => enemy.roomName === roomName && !enemy.mapTick
    );
    enemies.forEach((enemy) => {
      this.mount(enemy.uid);
    });
    return enemies;
  }

  dispose() {
    if (this.master) {
      matchMaker.presence.del("worldEnemySpawner:master");
    }
  }
}
