import { Schema, type } from "@colyseus/schema";

export default class PlayerState extends Schema {
  @type("number")
  targetTile?: number;
}
