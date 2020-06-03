import { EnemySpec } from "types/enemies";
import { SerializedObjectTile } from "utilities/tileMap";
import {
  getWorldTileId,
  worldAStar,
  pathToRandomTile,
  getLocalTileId,
  getMapColumns,
  getNextPathChunk,
} from "@server/utilities/world";
import EnemyState from "@server/components/enemy";
import { matchMaker } from "colyseus";
import { isPresent } from "utilities/guards";
import aStar from "utilities/movement/aStar";
import { tilesAdjacent } from "utilities/movement/surroundings";
import { mongoose } from "@colyseus/social";
import EnemySchema from "@server/db/EnemySchema";

export type WorldEnemyProps = {
  uid: string;
  spec: EnemySpec;
  objectTile: SerializedObjectTile<"enemy">;
  roomName: string;
  tilePath: number[];
  damage: number;
  currentTile?: number;
};

export class WorldEnemy {
  mapTick: boolean = false; // Whether the local map has control of the enemy or not
  uid: string; // The stateId to be persisted across rooms
  worldTilePath: { tileId: number; fileName: string }[] = [];
  currentWorldTile: number;
  localTilePath: number[];
  localCurrentTile: number;
  roomName: string;
  damage: number;
  enemyId: number = 0;
  displayName: string = "";
  spec: EnemySpec;
  objectTile: SerializedObjectTile<"enemy">;

  constructor({
    uid,
    spec,
    objectTile,
    roomName,
    tilePath = [],
    damage = 0,
    currentTile,
  }: WorldEnemyProps) {
    this.uid = uid;
    this.spec = spec;
    this.objectTile = objectTile;
    this.localCurrentTile = currentTile || objectTile.tileId;
    this.localTilePath = tilePath;
    this.damage = damage;
    this.roomName = roomName;
    this.currentWorldTile = this.calculateWorldTile();
    this.addListeners();
  }

  nextDestination() {
    const worldPath = pathToRandomTile(this.currentWorldTile);
    if (worldPath) {
      this.worldTilePath = worldPath.filter(isPresent);
    }
  }

  addListeners() {
    matchMaker.presence.subscribe(
      `worldEnemySpawner:requestPath:${this.uid}`,
      (localCurrentTile) => this.requestPath(localCurrentTile)
    );
  }

  requestPath(localCurrentTile: number) {
    console.log(this.roomName, "requestPath");
    this.localCurrentTile = localCurrentTile;
    this.calculateWorldTile();
    if (
      !this.worldTilePath.length ||
      this.currentWorldTile ===
        this.worldTilePath[this.worldTilePath.length - 1].tileId
    ) {
      this.nextDestination();
    }

    const pathChunkIndices = getNextPathChunk(
      this.roomName,
      this.worldTilePath
    );
    if (!pathChunkIndices) return;
    const localPath = pathChunkIndices
      ? this.worldTilePath
          .slice(pathChunkIndices.start, pathChunkIndices.end)
          .map((tile) => tile.tileId)
      : [];

    const lastLocalTile = localPath[localPath.length - 1];
    if (localCurrentTile === lastLocalTile) {
      this.worldTilePath.splice(
        pathChunkIndices.start,
        pathChunkIndices.end - pathChunkIndices.start + 1
      );

      this.changeMap();
      return;
    }

    if (lastLocalTile && localCurrentTile) {
      const newPath = aStar.findPath(
        this.roomName,
        localCurrentTile,
        lastLocalTile,
        getMapColumns(this.roomName)
      );
      matchMaker.presence.publish(
        `worldEnemySpawner:pathResponse:${this.uid}`,
        newPath
      );
    }
  }

  async changeMap() {
    matchMaker.presence.publish(
      `worldEnemySpawner:disposeEnemy:${this.uid}`,
      ""
    );

    const newTile = this.worldTilePath[0];
    this.mapTick = false;
    this.roomName = newTile.fileName;
    this.localCurrentTile = newTile.tileId;
    matchMaker.presence.publish(
      `worldEnemySpawner:newEnemy:${this.roomName}`,
      this
    );
    console.log(`${this.uid} has changed map to ${this.roomName}`);
  }

  saveToDb() {
    const Model = mongoose.model("Enemy", EnemySchema);
    return Model.findOneAndUpdate(
      {
        index: this.uid,
      },
      {
        enemyId: this.spec.id,
        zoneId: -1,
        currentTile: this.localCurrentTile,
        room: this.roomName,
        index: this.uid,
        traveler: true,
      },
      { upsert: true }
    );
  }

  calculateWorldTile() {
    return getWorldTileId(this.roomName, this.localCurrentTile);
  }

  async dispose(master = false) {
    matchMaker.presence.unsubscribe(
      `worldEnemySpawner:requestPath:${this.uid}`
    );
    if (master) {
      await this.saveToDb();
    }
  }
}
