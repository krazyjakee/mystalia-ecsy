import { makeHash, randomHash } from "utilities/hash";
import EnemyState from "@server/components/enemy";
import MapRoom from "src/server/rooms/map";
import {
  tileIdToVector,
  vectorToTileId,
  SerializedObjectTile,
  pathToTileIds,
} from "utilities/tileMap";
import { EnemySpec } from "types/enemies";
import ItemState from "@server/components/item";
import { randomNumberBetween, randomItemFromArray } from "utilities/math";
import { isPresent } from "utilities/guards";
import {
  distanceBetweenTiles,
  findClosestPath,
} from "utilities/movement/surroundings";
import PlayerState from "@server/components/player";
import { mongoose } from "@colyseus/social";
import EnemySchema from "@server/db/EnemySchema";
import { selectRandomPatrolTile } from "./behaviourHelpers/patrol";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

type EnemyProps = {
  spec: EnemySpec;
  room: MapRoom;
  allowedTiles: number[];
  zoneId: number;
  currentTile?: number;
  stateId?: string;
  objectTile?: SerializedObjectTile<"enemy">;
};

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
  kill: boolean = false;
  objectTile?: SerializedObjectTile<"enemy">;

  constructor({
    spec,
    room,
    allowedTiles,
    zoneId,
    currentTile,
    stateId,
    objectTile,
  }: EnemyProps) {
    this.spec = spec;
    this.objectTile = objectTile;
    this.room = room;
    this.allowedTiles = allowedTiles;
    this.stateId =
      stateId ||
      makeHash(`${new Date().getTime() + new Date().getMilliseconds()}`);
    this.mapColumns = this.room.mapData?.width || 0;
    this.speedMs = (10 - this.spec.speed) * 1000;

    this.currentTile = currentTile || randomItemFromArray(allowedTiles);

    if (zoneId === -1) {
      this.loadFromDB();
    } else {
      this.addToState(zoneId);
    }
  }

  addToState(zoneId: number) {
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

    const behavior = this.spec.behavior;

    if (this.tilePath.length) {
      this.timer = setTimeout(() => {
        if (behavior && behavior.patrol) {
          const playerTiles = Object.keys(this.room.state.players)
            .map((key) => {
              const player = this.room.state.players[key] as PlayerState;
              return player.targetTile;
            })
            .filter(isPresent);
          const distances = playerTiles.map((tile) =>
            distanceBetweenTiles(this.currentTile, tile, this.mapColumns)
          );
          const playerWithinDistance = distances.find(
            (d) => d <= (behavior.patrol?.distance || 0)
          );
          if (playerWithinDistance) {
            this.tick();
            return;
          }
        }

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
      const enemyState = this.room.state.enemies[this.stateId] as EnemyState;
      let delay = this.speedMs;
      if (enemyState.targetPlayer) {
        if (
          this.room.state.enemies[this.stateId] &&
          !this.findClosestTileToTargetPlayer()
        ) {
          (this.room.state.enemies[
            this.stateId
          ] as EnemyState).targetPlayer = undefined;
        }
      } else if (behavior && behavior.patrol) {
        delay = randomNumberBetween(
          behavior.patrol.standTime[1],
          behavior.patrol.standTime[0]
        );
        if (this.room.objectTileStore && this.objectTile) {
          const targetTile = selectRandomPatrolTile(
            this.room.objectTileStore,
            this.objectTile.properties.patrolId || 0
          );
          const path = this.room.objectTileStore.aStar.findPath(
            tileIdToVector(this.currentTile, this.mapColumns),
            tileIdToVector(targetTile, this.mapColumns)
          );
          this.tilePath = pathToTileIds(path, this.mapColumns);
        }
      } else {
        this.findNewTargetTile();
      }

      this.timer = setTimeout(() => {
        this.tick();
      }, delay);
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
    const columns = this.mapColumns;
    const targetTile = this.findRandomTile();

    if (!isPresent(targetTile)) {
      return this.destroy();
    }

    if (this.room.objectTileStore) {
      const currentTileVector = tileIdToVector(this.currentTile, columns);
      const targetTileVector = tileIdToVector(targetTile, columns);

      const aStarPath = this.room.objectTileStore.aStar.findPath(
        currentTileVector,
        targetTileVector
      );

      this.tilePath = pathToTileIds(aStarPath, this.mapColumns);
    }
  }

  findRandomTile() {
    const tilesWithinRadius = this.findTilesInRadius();
    let targetTile = this.currentTile;
    while (targetTile === this.currentTile) {
      targetTile = randomItemFromArray(tilesWithinRadius);
    }
    return targetTile;
  }

  findClosestTileToTargetPlayer() {
    if (!this.room.mapData || !this.room.objectTileStore) return;
    const columns = this.room.mapData.width;

    const enemyState = this.room.state.enemies[this.stateId] as EnemyState;
    if (!enemyState) return;
    const targetPlayer = enemyState.targetPlayer;
    if (!targetPlayer) return;
    const playerState = this.room.state.players[targetPlayer] as PlayerState;
    if (!playerState || !playerState.targetTile) return;
    const distance = distanceBetweenTiles(
      enemyState.currentTile,
      playerState.targetTile,
      columns
    );
    if (distance <= this.spec.maxDistance) {
      const path = findClosestPath(
        this.room.objectTileStore,
        enemyState.currentTile,
        playerState.targetTile
      );
      if (path) {
        this.tilePath = path;
      }
      return true;
    }
  }

  loadFromDB() {
    const enemies = mongoose.model("Enemy", EnemySchema);
    enemies.find(
      { room: this.room.roomName, zoneId: -1, index: this.stateId },
      (err, res) => {
        if (err) return console.log(err.message);
        res.forEach((doc) => {
          if (this.allowedTiles) {
            const obj = doc.toJSON();
            this.currentTile = obj.currentTile;
            this.addToState(-1);
          }
        });
        if (!res.length) {
          this.addToState(-1);
        }
      }
    );
  }

  destroy() {
    this.dispose();
    const enemy = this.room.state.enemies[this.stateId] as EnemyState;
    if (enemy) {
      console.log("destroy", this.stateId);
      const spec = enemySpecs.find(
        (enemySpec) => enemySpec.id === enemy.enemyId
      );
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
  }

  dispose() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
