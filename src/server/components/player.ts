import { Schema, type } from "@colyseus/schema";
import { hooks, IUser } from "@colyseus/social";
import { nameByRace } from "fantasy-name-generator";

export default class PlayerState extends Schema {
  @type("string")
  dbId?: string;

  @type("number")
  targetTile?: number;

  @type("string")
  displayName?: string;

  constructor(user: IUser) {
    super();
    this.dbId = user._id.toString();
    this.displayName = user.displayName;
  }
}

export const PlayerDBState = {
  currentTile: 2431,
  room: "first"
};

hooks.beforeAuthenticate((_, $setOnInsert) => {
  if ($setOnInsert.isAnonymous) {
    const customName = nameByRace("elf", { gender: "male" });
    if (typeof customName === "string") {
      $setOnInsert.displayName = customName;
    }
  }
  $setOnInsert.metadata = PlayerDBState;
});
