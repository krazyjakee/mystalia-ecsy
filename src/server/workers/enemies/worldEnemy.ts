import { EnemySpec } from "types/enemies";
import { SerializedObjectTile } from "utilities/tileMap";
import { getWorldTileId } from "@server/utilities/world";

export class WorldEnemy {
  uid?: string; // The stateId to be persisted across rooms
  worldTilePath: number[] = [];
  currentWorldTile: number;
  localTilePath: number[] = [];
  localCurrentTile: number;
  roomName: string;
  damage: number = 0;
  enemyId: number = 0;
  displayName: string = "";
  spec: EnemySpec;
  objectTile: SerializedObjectTile<"enemy">;

  constructor(
    spec: EnemySpec,
    objectTile: SerializedObjectTile<"enemy">,
    roomName: string
  ) {
    this.spec = spec;
    this.objectTile = objectTile;
    this.localCurrentTile = objectTile.tileId;
    this.roomName = roomName;
    this.currentWorldTile = this.calculateWorldTile();
  }

  calculateWorldTile() {
    return getWorldTileId(this.roomName, this.localCurrentTile);
  }
}
