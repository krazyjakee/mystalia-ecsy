import { makeHash } from "utilities/hash";
import EnemyState from "serverState/enemy";
import MapRoom from "src/server/rooms/map";
import { tileIdToVector, vectorToTileId } from "utilities/tileMap";
import { EnemySpec } from "types/enemies";

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

  constructor(spec: EnemySpec, room: MapRoom, allowedTiles: number[]) {
    this.spec = spec;
    this.room = room;
    this.allowedTiles = allowedTiles;
    this.stateId = `i${makeHash(
      `${new Date().getTime() + new Date().getMilliseconds()}`
    )}`;
    this.mapColumns = this.room.mapData?.width || 0;
    this.speedMs = (10 - this.spec.speed) * 1000;

    this.currentTile =
      allowedTiles[Math.floor(Math.random() * allowedTiles.length)];

    this.room.state.enemies[this.stateId] = new EnemyState(
      this.spec.id,
      this.currentTile
    );

    this.tick();
  }

  tick() {
    if (this.tilePath.length) {
      setTimeout(() => {
        const targetTile = this.tilePath.shift();
        if (targetTile) {
          (this.room.state.enemies[
            this.stateId
          ] as EnemyState).currentTile = targetTile;
        }
        this.tick();
      }, this.speedMs / 2);
    } else {
      setTimeout(() => {
        this.findNewTargetTile();
        this.tick();
      }, this.speedMs);
    }
  }

  findNewTargetTile() {
    // TODO: Add "awayFrom" and "towards" to force direction of movement
    const distance = this.spec.maxDistance;
    const columns = this.mapColumns;
    const topLeft = this.currentTile - distance * columns - distance;
    const tilesInRow = distance * 2 + 1;
    const tilesInRadius = tilesInRow * tilesInRow;

    let tilesWithinDistance: number[] = [];
    let rowCount = 0;
    let columnCount = 0;
    for (let i = 0; i < tilesInRadius; i += 1) {
      tilesWithinDistance.push(columnCount + topLeft + columns * rowCount);

      if (columnCount === tilesInRow) {
        columnCount = 0;
        rowCount += 1;
      } else {
        columnCount += 1;
      }
    }

    tilesWithinDistance = tilesWithinDistance.filter(tile =>
      this.allowedTiles.includes(tile)
    );

    const targetTile =
      tilesWithinDistance[
        Math.floor(Math.random() * tilesWithinDistance.length) + 1
      ];

    // TODO: Fix bug where targetTileVector is NaN
    const currentTileVector = tileIdToVector(this.currentTile, columns);
    const targetTileVector = tileIdToVector(targetTile, columns);
    this.room.aStar.findPath(
      currentTileVector.x,
      currentTileVector.y,
      targetTileVector.x,
      targetTileVector.y,
      path => {
        this.tilePath = path.map(tileVector =>
          vectorToTileId(tileVector, columns)
        );
      }
    );
    this.room.aStar.calculate();
  }

  destroy() {
    this.dispose();
    delete this.room.state.enemies[this.stateId];
  }

  dispose() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
