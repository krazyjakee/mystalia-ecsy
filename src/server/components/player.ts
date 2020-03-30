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

  @type("number")
  role?: number;

  constructor(user: IUser) {
    super();
    this.dbId = user._id.toString();
    this.displayName = user.displayName;
    this.role = user.metadata.role;
  }
}

export const UserDBState = {
  currentTile: 2431,
  room: "first",
  role: 0
};

hooks.beforeAuthenticate((_, $setOnInsert) => {
  if ($setOnInsert.isAnonymous) {
    const customName = nameByRace("elf", { gender: "male" });
    if (typeof customName === "string") {
      $setOnInsert.displayName = customName;
    }
  }
  $setOnInsert.metadata = UserDBState;
});
