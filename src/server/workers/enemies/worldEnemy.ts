import { EnemySpec } from "types/enemies";
import { SerializedObjectTile } from "utilities/tileMap";
import {
  getWorldTileId,
  worldAStar,
  pathToRandomTile,
  getLocalTileId,
  getMapColumns,
} from "@server/utilities/world";
import EnemyState from "@server/components/enemy";
import { matchMaker } from "colyseus";
import { isPresent } from "utilities/guards";
import aStar from "utilities/movement/aStar";

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
      this.requestPath
    );
  }

  requestPath(localCurrentTile: number) {
    this.localCurrentTile = localCurrentTile;
    this.calculateWorldTile();
    if (
      this.currentWorldTile ===
      this.worldTilePath[this.worldTilePath.length - 1].tileId
    ) {
      this.nextDestination();
    }

    const localPath = this.worldTilePath
      .filter((worldTile) => worldTile.fileName === this.roomName)
      .map((worldTile) => worldTile.tileId);
    const lastLocalTile = localPath[localPath.length - 1];
    if (localCurrentTile === lastLocalTile) {
      // TODO: If the local current tile is the last one in the tilepath, move the traveler to the next map
      return;
    }

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

  calculateWorldTile() {
    return getWorldTileId(this.roomName, this.localCurrentTile);
  }

  dispose() {}
}
