import { Schema, type, ArraySchema } from "@colyseus/schema";

export default class EnemyState extends Schema {
  @type("number")
  enemyId: number;

  @type("number")
  currentTile: number;

  @type(["number"])
  path: ArraySchema<number>;

  constructor(enemyId: number, currentTile: number) {
    super();
    this.path = new ArraySchema<number>();
    this.currentTile = currentTile;
    this.enemyId = enemyId;
  }
}
