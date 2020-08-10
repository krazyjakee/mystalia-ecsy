import { Schema, type, MapSchema } from "@colyseus/schema";
import { hooks, IUser } from "@colyseus/social";
import { nameByRace } from "fantasy-name-generator";
import InventoryState from "./inventory";
import { arrayToMapSchema } from "../utilities/colyseusState";

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

  @type("number")
  xp: number;

  @type("number")
  damage: number;

  @type("number")
  energyUsed: number;

  @type("string")
  currentRoom: string;

  @type("string")
  targetEnemy?: string;

  @type({ map: InventoryState })
  inventory: MapSchema<InventoryState>;

  constructor(user: IUser, room: string) {
    super();
    this.dbId = user._id.toString();
    this.displayName = user.displayName;
    this.username = user.username;
    this.role = user.metadata.role;
    this.xp = user.metadata.xp;
    this.damage = user.metadata.damage;
    this.energyUsed = user.metadata.energyUsed;
    this.inventory = arrayToMapSchema(
      user.metadata.inventory || [],
      InventoryState
    );
    this.currentRoom = room;
  }
}

export const UserDBState = {
  currentTile: 3107,
  room: "west",
  role: 0,
  inventory: [],
  xp: 0,
  damage: 0,
  energyUsed: 0,
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
