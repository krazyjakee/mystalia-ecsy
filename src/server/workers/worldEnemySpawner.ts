import { WorldEnemy, WorldEnemyProps } from "./enemies/worldEnemy";
import { mongoose } from "@colyseus/social";
import EnemySchema from "@server/db/EnemySchema";
import { EnemySpec } from "types/enemies";
import { readMapFiles } from "@server/utilities/mapFiles";
import { getTilesByType, SerializedObjectTile } from "utilities/tileMap";
import { makeHash } from "utilities/hash";
import { matchMaker } from "colyseus";
import MapRoom from "@server/rooms/map";
import { isPresent } from "utilities/guards";
import { objectForEach } from "utilities/loops";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class WorldEnemySpawner {
  room: MapRoom;
  master: boolean = false;
  enemies: WorldEnemy[] = [];

  constructor(room: MapRoom) {
    this.room = room;
    this.checkForMaster();
    // TODO: Disabled until inaccessible maps don't cause an inifinite loop in travelers somewhere
  }

  async checkForMaster() {
    if (!matchMaker.presence) return;

    const worldEnemySpawnerMasterExists = await matchMaker.presence.hget(
      `worldEnemySpawner:master`,
      "i"
    );
    if (!worldEnemySpawnerMasterExists) {
      this.master = true;
      matchMaker.presence.hset(`worldEnemySpawner:master`, "i", "i");
      this.startListeners();
      await this.loadFromDB();
      this.loadTheRest();
      matchMaker.presence.publish("worldEnemySpawner:ready", "");
      console.log(
        `room "${this.room.roomName}" is now worldEnemySpawner master`
      );
    }
  }

  loadFromDB() {
    return new Promise((accept, reject) => {
      const enemies = mongoose.model("Enemy", EnemySchema);
      enemies.find({ traveler: true }, (err, res) => {
        if (err) return console.log(err.message);
        res.forEach((doc) => {
          const obj = doc.toJSON();
          const spec = enemySpecs.find((spec) => spec.id === obj.enemyId);
          const objectTile = this.getObjectTile(obj.index);
          if (spec && objectTile) {
            this.addEnemy({
              uid: obj.index,
              spec,
              objectTile,
              currentTile: obj.currentTile,
              roomName: obj.room,
              tilePath: obj.tilePath,
              damage: obj.damage,
            });
          }
        });
        console.log(`${res.length} WorldEnemies loaded from the DB`);
        accept();
      });
    });
  }

  loadTheRest() {
    const maps = readMapFiles();
    objectForEach(maps, (roomName, map) => {
      const enemyObjects = getTilesByType("enemy", map);
      enemyObjects.forEach((enemyObject) => {
        const spec = enemySpecs.find(
          (spec) => spec.id === enemyObject.properties?.id
        );
        if (spec && isPresent(spec.behavior.traveler)) {
          this.addEnemy({
            uid: this.generateUid(enemyObject),
            spec,
            objectTile: enemyObject,
            currentTile: enemyObject.tileId,
            roomName,
            tilePath: [],
            damage: 0,
          });
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
  }

  getObjectTile(stateId: string) {
    const maps = readMapFiles();
    const mapKeys = Object.keys(maps);
    for (let i = 0; i < mapKeys.length; i += 1) {
      const map = maps[mapKeys[i]];
      const enemyObjects = getTilesByType("enemy", map);
      const objectTile = enemyObjects.find(
        (enemyObject) => this.generateUid(enemyObject) === stateId
      );
      if (objectTile) {
        return objectTile;
      }
    }
  }

  generateUid(enemyObject: SerializedObjectTile<"enemy">) {
    return makeHash(`${enemyObject.properties?.id}_${enemyObject.tileId}`);
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

  mountRoom(roomName: string) {
    const enemies = this.enemies.filter((enemy) => enemy.roomName === roomName);
    enemies.forEach((enemy) => {
      this.mount(enemy.uid);
    });
    console.log(`${roomName} mounted ${enemies.length} world enemies`);
    return enemies;
  }

  async dispose() {
    matchMaker.presence.unsubscribe("worldEnemySpawner:mountRoom");
    await Promise.all(this.enemies.map((enemy) => enemy.dispose(this.master)));
    if (this.master) {
      matchMaker.presence.del("worldEnemySpawner:master");
    }
  }
}
