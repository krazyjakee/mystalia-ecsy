import { Schema, type } from "@colyseus/schema";

export default class EnemyState extends Schema {
  @type("number")
  enemyId: number;

  @type("number")
  zoneId?: number;

  @type("number")
  currentTile: number;

  @type("string")
  target?: string;

  constructor(enemyId: number, currentTile: number, zoneId?: number) {
    super();
    this.currentTile = currentTile;
    this.enemyId = enemyId;
    this.zoneId = zoneId;
  }
}
