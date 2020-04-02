import { Schema, type } from "@colyseus/schema";
import { hooks, IUser } from "@colyseus/social";
import { nameByRace } from "fantasy-name-generator";

export default class PlayerState extends Schema {
  @type("string")
  dbId: string;

  @type("string")
  username: string;

  @type("number")
  targetTile?: number;

  @type("string")
  displayName: string;

  @type("number")
  role: number;

  @type("string")
  currentRoom: string;

  constructor(user: IUser, room: string) {
    super();
    this.dbId = user._id.toString();
    this.displayName = user.displayName;
    this.username = user.username;
    this.role = user.metadata.role;
    this.currentRoom = room;
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
      $setOnInsert.username = customName.toLowerCase();
    }
  }
  $setOnInsert.metadata = UserDBState;
});
