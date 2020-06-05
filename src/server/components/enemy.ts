import { Schema, type, ArraySchema } from "@colyseus/schema";

export default class EnemyState extends Schema {
  @type("string")
  displayName?: string;

  @type("number")
  enemyId: number;

  @type("number")
  zoneId?: number;

  @type("number")
  currentTile: number;

  @type(["number"])
  tilePath = new ArraySchema<number>();

  @type("string")
  targetPlayer?: string;

  @type("number")
  damage: number = 0;

  constructor(
    enemyId: number,
    currentTile: number,
    zoneId?: number,
    displayName?: string,
    tilePath: number[] = []
  ) {
    super();
    this.displayName = displayName;
    this.currentTile = currentTile;
    this.tilePath = new ArraySchema(...tilePath);
    this.enemyId = enemyId;
    this.zoneId = zoneId;
  }
}
