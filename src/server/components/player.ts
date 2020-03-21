import { Schema, type } from "@colyseus/schema";

export default class PlayerState extends Schema {
  @type("string")
  dbId?: string;

  @type("number")
  targetTile?: number;

  constructor(dbId: string) {
    super();
    this.dbId = dbId;
  }
}

export const PlayerDBState = {
  currentTile: 2431,
  room: "first"
};
