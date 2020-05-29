import { EnemySpec } from "types/enemies";
import { ObjectTileAndTileId } from "utilities/tileMap";
import { getWorldTileId } from "@server/utilities/world";

export type WorldEnemyProps = {
  uid: string;
  spec: EnemySpec;
  objectTile: ObjectTileAndTileId<"enemy">;
  roomName: string;
  tilePath: number[];
  damage: number;
  currentTile?: number;
};

export class WorldEnemy {
  mapTick: boolean = false; // Whether the local map has control of the enemy or not
  uid: string; // The stateId to be persisted across rooms
  worldTilePath: number[] = [];
  currentWorldTile: number;
  localTilePath: number[];
  localCurrentTile: number;
  roomName: string;
  damage: number;
  enemyId: number = 0;
  displayName: string = "";
  spec: EnemySpec;
  objectTile: ObjectTileAndTileId<"enemy">;

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

  calculateWorldTile() {
    return getWorldTileId(this.roomName, this.localCurrentTile);
  }
}
