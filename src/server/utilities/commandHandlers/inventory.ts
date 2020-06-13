import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import ItemState from "@server/components/item";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { randomHash } from "utilities/hash";
import { searchState } from "../colyseusState";
import { objectMap } from "utilities/loops";

const items = require("utilities/data/items.json") as ItemSpec[];

export const addItemToPlayer = (
  inventoryState: MapSchema<InventoryState>,
  item: ItemState
) => {
  // If item already in inventory, add quantity
  const matches = searchState(inventoryState, { itemId: item.itemId });
  matches.forEach((key) => {
    inventoryState[key].quantity += item.quantity;
  });
  if (matches.length) return;

  // Otherwise add the item
  const positions = Object.values<number>(
    objectMap(inventoryState, (_, value: InventoryState) => value.position)
  );
  positions.sort();

  const highestPosition = positions[positions.length - 1];
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

  inventoryState[randomHash()] = new InventoryState({
    itemId: item.itemId,
    position: missingPosition,
    quantity: item.quantity,
    equipped: false,
  });

  return true;
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

export const getEquippedItemKey = (inventoryState: MapSchema<InventoryState>) =>
  searchState(inventoryState, { equipped: true })[0];

export const equipItem = (
  inventoryState: MapSchema<InventoryState>,
  position: number
) => {
  for (let key in inventoryState) {
    const item = inventoryState[key] as InventoryState;
    const spec = items.find((itemSpec) => itemSpec.id === item.itemId);
    if (spec && item.position === position && spec.equippable) {
      const equippedItemKey = getEquippedItemKey(inventoryState);
      if (equippedItemKey) {
        inventoryState[equippedItemKey].equipped = false;
        if (inventoryState[equippedItemKey].position === position) {
          return;
        }
      }

      inventoryState[key].equipped = true;
    }
  }
};
