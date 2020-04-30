import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import ItemState from "@server/components/item";
import { safeMapSchemaIndex } from "../colyseusState";

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
    position: missingPosition,
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
