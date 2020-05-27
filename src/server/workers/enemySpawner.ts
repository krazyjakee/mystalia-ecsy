import EnemyZone from "./enemies/enemyZone";
import { getTilesByType } from "utilities/tileMap";
import MapRoom from "@server/rooms/map";
import Enemy from "./enemies/enemy";
import { EnemySpec } from "types/enemies";
import { makeHash } from "utilities/hash";
import { isPresent } from "utilities/guards";
import { randomNumberBetween } from "utilities/math";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class EnemySpawner {
  room: MapRoom;
  timer: NodeJS.Timeout;
  enemyZones: EnemyZone[] = [];
  enemies: Enemy[] = [];

  constructor(room: MapRoom) {
    this.room = room;

    if (room.mapData) {
      this.enemyZones =
        getTilesByType("enemyZone", room.mapData).map(
          (zoneConfig) => new EnemyZone(zoneConfig, room)
        ) || [];

      this.enemyZones.forEach((zone) => zone.loadFromDB());
      this.addEnemies();
    }

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  addEnemies() {
    if (!this.room.mapData) return;

    getTilesByType("enemy", this.room.mapData).forEach((objectTile) => {
      const roll = randomNumberBetween(objectTile.properties.chance);
      if (roll != 1) return;

      const spec = enemySpecs[objectTile.properties.id];
      const stateId = makeHash(
        `${objectTile.properties.id}_${objectTile.tileId}`
      );
      if (this.room?.objectTileStore && !this.room.state.enemies[stateId]) {
        this.enemies.push(
          new Enemy({
            spec: spec,
            room: this.room,
            allowedTiles: this.room.objectTileStore.blockList,
            currentTile: objectTile.tileId,
            zoneId: -1,
            stateId,
            objectTile,
          })
        );
      }
    });
  }

  tick() {
    this.enemyZones.forEach((enemyZone) => enemyZone.tick());
    this.addEnemies();
  }

  destroy(stateId: string) {
    this.enemyZones.forEach((enemyZone) => {
      enemyZone.destroy(stateId);
    });
    this.enemies.forEach((enemy) => enemy.stateId && enemy.destroy());
  }

  dispose() {
    clearInterval(this.timer);
    this.enemyZones.forEach((enemyZone) => enemyZone.dispose());
    this.enemies.forEach((enemy) => enemy.dispose());
  }
}
