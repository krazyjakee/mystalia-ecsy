import { Schema, type } from "@colyseus/schema";

export default class EnemyState extends Schema {
  @type("string")
  displayName?: string;

  @type("number")
  enemyId: number;

  @type("number")
  zoneId?: number;

  @type("number")
  currentTile: number;

  @type("string")
  targetPlayer?: string;

  @type("number")
  damage: number = 0;

  constructor(
    enemyId: number,
    currentTile: number,
    zoneId?: number,
    displayName?: string
  ) {
    super();
    this.displayName = displayName;
    this.currentTile = currentTile;
    this.enemyId = enemyId;
    this.zoneId = zoneId;
  }
}
