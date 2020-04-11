import { Schema, type, MapSchema } from "@colyseus/schema";
import { hooks, IUser } from "@colyseus/social";
import { nameByRace } from "fantasy-name-generator";
import InventoryState from "./inventory";
import ItemState from "./item";
import {
  safeMapSchemaIndex,
  arrayToMapSchema,
} from "../utilities/colyseusState";

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
    this.inventory = arrayToMapSchema(
      user.metadata.inventory || [],
      InventoryState
    );
    this.currentRoom = room;
  }
}

export const addItemToPlayer = (
  inventoryState: MapSchema<InventoryState>,
  item: ItemState
) => {
  // If item already in inventory, add quantity
  for (let key in inventoryState) {
    const inventoryItem = inventoryState[key] as InventoryState;
    if (inventoryItem.itemId === item.itemId) {
      inventoryState[key].quantity += item.quantity;
      return;
    }
  }

  // Otherwise add the item
  const inventoryKeys = Object.keys(inventoryState);
  const positions = inventoryKeys.map((key: string) => {
    const item = inventoryState[key] as InventoryState;
    return item.position;
  });
  positions.sort();

  const highestPosition = positions[0];
  let missingPosition = 0;
  while (missingPosition <= highestPosition) {
    if (missingPosition === highestPosition) {
      missingPosition += 1;
    }

    if (positions.includes(missingPosition)) {
      missingPosition += 1;
    } else {
      break;
    }
  }

  const safeIndex = safeMapSchemaIndex(inventoryKeys.length);
  inventoryState[safeIndex] = new InventoryState({
    itemId: item.itemId,
    position: missingPosition || 0,
    quantity: item.quantity,
  });
};

export const moveInventoryItem = (
  from: number,
  to: number,
  inventoryState: MapSchema<InventoryState>
) => {
  for (let key in inventoryState) {
    const item = inventoryState[key];
    if (item.position === from) {
      inventoryState[key].position = to;
    } else if (item.position === to) {
      inventoryState[key].position = from;
    }
  }
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
