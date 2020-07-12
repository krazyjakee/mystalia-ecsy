import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import { CraftableSpec } from "types/craftable";
import inventoryStateToArray from "@client/react/Panels/Inventory/inventoryStateToArray";
import mergeQuantities from "@client/react/Panels/Crafting/mergeQuantities";

export const canCraft = (
  inventoryState: MapSchema<InventoryState>,
  craftable: CraftableSpec
) => {
  const inventoryItems = inventoryStateToArray(inventoryState);
  const mergedInventoryState = mergeQuantities(inventoryItems);

  const hasRequiredItem = craftable.requiredItems.length
    ? mergedInventoryState.filter((item) =>
        craftable.requiredItems.includes(item.itemId)
      ).length > 0
    : true;
  const hasIngredients =
    craftable.ingredients.filter((ingredient) =>
      mergedInventoryState.find(
        (item) =>
          item.itemId === ingredient.itemId &&
          item.quantity >= ingredient.quantity
      )
    ).length === craftable.ingredients.length;
  return hasRequiredItem && hasIngredients;
};
