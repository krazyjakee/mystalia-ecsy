import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import { TradeSpec } from "types/shops";
import { isPresent } from "utilities/guards";
import { addItemToPlayer } from "./inventory";
import ItemState from "@server/components/item";
import { searchState } from "../colyseusState";

export const canPerformTrade = (
  inventoryState: MapSchema<InventoryState>,
  trade: TradeSpec
) => {
  const mergedQuantities: { [key: number]: number } = {};
  for (let key in inventoryState) {
    const inventoryItem = inventoryState[key] as InventoryState;
    if (isPresent(mergedQuantities[inventoryItem.itemId])) {
      mergedQuantities[inventoryItem.itemId] += inventoryItem.quantity;
    } else {
      mergedQuantities[inventoryItem.itemId] = inventoryItem.quantity;
    }
  }
  return mergedQuantities[trade.buy] >= trade.buyAmount;
};

export const performTrade = (
  inventoryState: MapSchema<InventoryState>,
  trade: TradeSpec
) => {
  if (canPerformTrade(inventoryState, trade)) {
    let keysToDelete: string[] = [];
    let quantity = trade.buyAmount;
    searchState(inventoryState, { itemId: trade.buy }).forEach((key) => {
      const inventoryItem = inventoryState[key];
      if (quantity - inventoryItem.quantity >= 0) {
        keysToDelete.push(key);
        quantity -= inventoryItem.quantity;
      } else {
        inventoryState[key].quantity -= quantity;
      }
    });

    keysToDelete.forEach((key) => {
      delete inventoryState[key];
    });

    const newItem = new ItemState(trade.sell, 0, trade.sellAmount);
    addItemToPlayer(inventoryState, newItem);
  }
};
