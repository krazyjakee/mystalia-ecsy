import { Schema, type, ArraySchema } from "@colyseus/schema";

export default class EnemyState extends Schema {
  @type("number")
  enemyId: number;

  @type("number")
  currentTile: number;

  constructor(enemyId: number, currentTile: number) {
    super();
    this.currentTile = currentTile;
    this.enemyId = enemyId;
  }
}
