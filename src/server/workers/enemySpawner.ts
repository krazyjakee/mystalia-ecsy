import EnemyZone from "./enemies/enemyZone";
import { getTilesByType } from "utilities/tileMap";
import MapRoom from "@server/rooms/map";
import Enemy, { EnemyProps } from "./enemies/enemy";
import { EnemySpec } from "types/enemies";
import { makeHash } from "utilities/hash";
import { randomNumberBetween } from "utilities/math";
import { matchMaker } from "colyseus";
import { WorldEnemy } from "./enemies/worldEnemy";
import { saveStateToDb } from "@server/utilities/dbState";
import EnemyState from "@server/components/enemy";

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
      this.addListeners();
    }

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  addEnemy(enemyProps: EnemyProps) {
    this.enemies.push(new Enemy(enemyProps));
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

      if (spec.behavior.traveler) {
        return;
      }

      if (this.room.objectTileStore && !this.room.state.enemies[stateId]) {
        this.addEnemy({
          spec: spec,
          room: this.room,
          allowedTiles: this.room.objectTileStore.blockList,
          currentTile: objectTile.tileId,
          zoneId: -1,
          stateId,
          objectTile,
        });
      }
    });
  }

  addListeners() {
    matchMaker.presence.subscribe(
      `worldEnemySpawner:roomMounted:${this.room.roomName}`,
      (worldEnemies: WorldEnemy[]) => {
        worldEnemies.forEach((worldEnemy) => {
          if (this.room.objectTileStore) {
            // TODO: Are the enemies being added?
            this.addEnemy({
              spec: worldEnemy.spec,
              room: this.room,
              allowedTiles: this.room.objectTileStore.blockList,
              currentTile: worldEnemy.objectTile.tileId,
              zoneId: -1,
              stateId: worldEnemy.uid,
              objectTile: worldEnemy.objectTile,
            });
          }
        });
      }
    );

    matchMaker.presence.publish(
      "worldEnemySpawner:mountRoom",
      this.room.roomName
    );
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

  async dispose() {
    clearInterval(this.timer);
    this.enemyZones.forEach((enemyZone) => enemyZone.dispose());
    this.enemies.forEach((enemy) => enemy.dispose());
    matchMaker.presence.unsubscribe(
      `worldEnemySpawner:roomMounted:${this.room.roomName}`
    );
    await saveStateToDb(
      "Enemy",
      this.room.roomName,
      this.room.state.enemies,
      (enemyState: EnemyState) => {
        const traveler = { traveler: true };
        const spec = enemySpecs[enemyState.enemyId];
        return {
          ...enemyState,
          ...(spec.behavior.traveler ? traveler : {}),
        };
      }
    );
  }
}
