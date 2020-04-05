import { Schema, type, MapSchema } from "@colyseus/schema";
import { hooks, IUser } from "@colyseus/social";
import { nameByRace } from "fantasy-name-generator";
import InventoryState from "./inventory";
import ItemState from "./item";

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

  @type({ map: InventoryState })
  inventory = new MapSchema<InventoryState>();

  constructor(user: IUser, room: string) {
    super();
    this.dbId = user._id.toString();
    this.displayName = user.displayName;
    this.username = user.username;
    this.role = user.metadata.role;
    this.currentRoom = room;
  }
}

export const addItemToPlayer = (
  inventoryState: MapSchema<InventoryState>,
  item: ItemState
) => {
  const inventoryKeys = Object.keys(inventoryState);
  const positions = inventoryKeys.map((key: string) => {
    const item = inventoryState[key] as InventoryState;
    return item.position;
  });
  positions.sort();
  const len = inventoryKeys.length;
  const sum = ((len + 1) * (positions[0] + positions[len - 1])) / 2;
  const missingPosition = sum - positions.reduce((x, y) => x + y);
  inventoryState[inventoryKeys.length] = new InventoryState(
    item.itemId,
    missingPosition,
    item.quantity
  );
};

export const UserDBState = {
  currentTile: 2431,
  room: "first",
  role: 0,
  inventory: [],
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
