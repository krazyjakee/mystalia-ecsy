import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import { addItemToPlayer } from "./inventory";
import ItemState from "@server/components/item";
import { searchState } from "../colyseusState";
import { canCraft } from "utilities/inventory/crafting";
import { CraftableSpec } from "types/craftable";

export const performCraft = (
  inventoryState: MapSchema<InventoryState>,
  craftable: CraftableSpec
) => {
  if (canCraft(inventoryState, craftable)) {
    let keysToDelete: string[] = [];

    craftable.ingredients.forEach((ingredient) => {
      let quantity = ingredient.quantity;
      searchState(inventoryState, { itemId: ingredient.itemId }).forEach(
        (key) => {
          const inventoryItem = inventoryState[key];
          if (quantity - inventoryItem.quantity >= 0) {
            keysToDelete.push(key);
            quantity -= inventoryItem.quantity;
          } else {
            inventoryState[key].quantity -= quantity;
          }
        }
      );
    });

    keysToDelete.forEach((key) => {
      delete inventoryState[key];
    });

    const newItem = new ItemState(craftable.item, 0, 1);
    addItemToPlayer(inventoryState, newItem);
  }
};
