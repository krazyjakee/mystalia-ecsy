import { WorldEnemy, WorldEnemyProps } from "./enemies/worldEnemy";
import { mongoose } from "@colyseus/social";
import EnemySchema from "@server/db/EnemySchema";
import { EnemySpec } from "types/enemies";
import { readMapFiles } from "@server/utilities/mapFiles";
import { getTilesByType, SerializedObjectTile } from "utilities/tileMap";
import { makeHash } from "utilities/hash";
import { matchMaker } from "colyseus";
import MapRoom from "@server/rooms/map";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class WorldEnemySpawner {
  room: MapRoom;
  master: boolean = false;
  enemies: WorldEnemy[] = [];

  constructor(room: MapRoom) {
    this.room = room;
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
      this.loadFromDB();
      this.startListeners();
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

  startListeners() {
    matchMaker.presence.subscribe(
      "worldEnemySpawner:mountRoom",
      (roomName: string) => {
        const worldEnemies = this.mountRoom(roomName);
        matchMaker.presence.publish(
          `worldEnemySpawner:roomMounted:${roomName}`,
          worldEnemies
        );
      }
    );

    matchMaker.presence.subscribe(
      "worldEnemySpawner:unmountRoom",
      (roomName: string) => {
        this.mountRoom(roomName, true);
      }
    );
  }

  getObjectTile({
    roomName,
    stateId,
  }: {
    roomName: string;
    stateId: string;
  }): (SerializedObjectTile<"enemy"> & { uid: string }) | undefined {
    const maps = readMapFiles();
    const map = maps[roomName];
    const enemyObjects = getTilesByType("enemy", map);
    const objectTile = enemyObjects.find(
      (enemyObject) =>
        makeHash(`${enemyObject.properties.id}_${enemyObject.tileId}`) ===
        stateId
    );
    if (objectTile) {
      const uid = `${objectTile.properties.id}_${objectTile.tileId}`;
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

  mount(stateId: string, unmount = false) {
    const index = this.enemies.findIndex((enemy) => enemy.uid === stateId);
    if (index > -1) {
      this.enemies[index].mapTick = !unmount;
    }
  }

  exists(stateId: string) {
    return this.enemies.findIndex((enemy) => enemy.uid === stateId) > -1;
  }

  mountRoom(roomName: string, unmount = false) {
    const enemies = this.enemies.filter((enemy) =>
      unmount
        ? enemy.roomName === roomName && enemy.mapTick
        : enemy.roomName === roomName && !enemy.mapTick
    );
    enemies.forEach((enemy) => {
      this.mount(enemy.uid, unmount);
    });
    return enemies;
  }

  dispose() {
    if (this.master) {
      matchMaker.presence.del("worldEnemySpawner:master");
      matchMaker.presence.unsubscribe("worldEnemySpawner:unmountRoom");
      matchMaker.presence.unsubscribe("worldEnemySpawner:mountRoom");
    }
  }
}
