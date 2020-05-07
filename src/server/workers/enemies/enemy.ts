import { makeHash, randomHash } from "utilities/hash";
import EnemyState from "@server/components/enemy";
import MapRoom from "src/server/rooms/map";
import { tileIdToVector, vectorToTileId } from "utilities/tileMap";
import { EnemySpec } from "types/enemies";
import ItemState from "@server/components/item";
import { randomNumberBetween } from "utilities/math";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class Enemy {
  stateId: string;
  currentTile: number;
  tilePath: number[] = [];
  spec: EnemySpec;
  room: MapRoom;
  allowedTiles: number[];
  timer?: NodeJS.Timeout;
  mapColumns: number;
  speedMs: number;

  constructor(
    spec: EnemySpec,
    room: MapRoom,
    allowedTiles: number[],
    zoneId?: number,
    currentTile?: number,
    stateId?: string
  ) {
    this.spec = spec;
    this.room = room;
    this.allowedTiles = allowedTiles;
    this.stateId =
      stateId ||
      makeHash(`${new Date().getTime() + new Date().getMilliseconds()}`);
    this.mapColumns = this.room.mapData?.width || 0;
    this.speedMs = (10 - this.spec.speed) * 1000;

    this.currentTile =
      currentTile || allowedTiles[randomNumberBetween(allowedTiles.length, 0)];

    this.room.state.enemies[this.stateId] = new EnemyState(
      this.spec.id,
      this.currentTile,
      zoneId
    );

    this.tick();
  }

  tick() {
    if (!this.room.state.enemies[this.stateId]) {
      return;
    }

    if (this.tilePath.length) {
      setTimeout(() => {
        const targetTile = this.tilePath.shift();
        if (targetTile && this.room.state.enemies[this.stateId]) {
          this.currentTile = targetTile;
          (this.room.state.enemies[
            this.stateId
          ] as EnemyState).currentTile = targetTile;
        }
        this.tick();
      }, 1000 / this.spec.speed);
    } else {
      setTimeout(() => {
        this.findNewTargetTile();
        this.tick();
      }, this.speedMs);
    }
  }

  findTilesInRadius() {
    const distance = this.spec.maxDistance;
    const columns = this.mapColumns;
    const topLeft = this.currentTile - distance * columns - distance;
    const tilesInRow = distance * 2 + 1;
    const tilesInRadius = tilesInRow * tilesInRow;

    let tilesWithinRadius: number[] = [];
    let rowCount = 0;
    let columnCount = 0;

    for (let i = 0; i < tilesInRadius; i += 1) {
      tilesWithinRadius.push(columnCount + topLeft + columns * rowCount);
      if (columnCount === tilesInRow - 1) {
        columnCount = 0;
        rowCount += 1;
      } else {
        columnCount += 1;
      }
    }

    tilesWithinRadius = tilesWithinRadius.filter((tile) =>
      this.allowedTiles.includes(tile)
    );

    return tilesWithinRadius;
  }

  findNewTargetTile() {
    // TODO: Add "awayFrom" and "towards" to force direction of movement
    const columns = this.mapColumns;

    const tilesWithinRadius = this.findTilesInRadius();

    let targetTile = this.currentTile;
    while (targetTile === this.currentTile) {
      targetTile =
        tilesWithinRadius[randomNumberBetween(tilesWithinRadius.length, 0)];
    }

    if (!targetTile) {
      this.destroy();
      return;
    }

    if (this.room.objectTileStore) {
      const currentTileVector = tileIdToVector(this.currentTile, columns);
      const targetTileVector = tileIdToVector(targetTile, columns);

      const aStarPath = this.room.objectTileStore.aStar.findPath(
        currentTileVector,
        targetTileVector
      );

      this.tilePath = aStarPath.map((tileVector) =>
        vectorToTileId(
          {
            x: tileVector[0],
            y: tileVector[1],
          },
          columns
        )
      );
    }
  }

  destroy() {
    this.dispose();
    const enemy = this.room.state.enemies[this.stateId] as EnemyState;
    const spec = enemySpecs.find((enemySpec) => enemySpec.id === enemy.enemyId);
    if (spec?.drop) {
      spec.drop.forEach((drop) => {
        const roll = randomNumberBetween(drop.chance) === 1;
        if (roll) {
          const quantity = randomNumberBetween(
            drop.quantity[0],
            drop.quantity[1]
          );
          this.room.state.items[randomHash()] = new ItemState(
            drop.itemId,
            enemy.currentTile,
            quantity
          );
        }
      });
    }
    delete this.room.state.enemies[this.stateId];
  }

  dispose() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
