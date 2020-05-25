import EnemyZone from "./enemies/enemyZone";
import { getTilesByType } from "utilities/tileMap";
import MapRoom from "@server/rooms/map";
import Enemy from "./enemies/enemy";
import { EnemySpec } from "types/enemies";
import { makeHash } from "utilities/hash";

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

      this.enemies =
        getTilesByType("enemy", room.mapData).map((enemyConfig, index) => {
          const spec = enemySpecs[enemyConfig.properties.id];
          if (this.room?.objectTileStore?.blockList) {
            return new Enemy(
              spec,
              this.room,
              this.room.objectTileStore.blockList,
              -1,
              enemyConfig.tileId,
              makeHash(`${enemyConfig.properties.id}_${index}`),
              enemyConfig
            );
          }
          return new Enemy(spec, this.room, []);
        }) || [];

      this.enemies.forEach((enemy) => enemy.loadFromDB());
    }

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.enemyZones.forEach((enemyZone) => enemyZone.tick());
    this.enemies.forEach((enemy) => enemy.tick());
  }

  destroy(stateId: string) {
    this.enemyZones.forEach((enemyZone) => {
      enemyZone.destroy(stateId);
    });
    this.enemies.forEach((enemy) => enemy.destroy());
  }

  dispose() {
    clearInterval(this.timer);
    this.enemyZones.forEach((enemyZone) => enemyZone.dispose());
    this.enemies.forEach((enemy) => enemy.dispose());
  }
}
