import InventoryState from "@server/components/inventory";
import { InventoryItems } from "types/TileMap/ItemTiles";
import itemsData from "utilities/data/items.json";
import { MapSchema } from "@colyseus/schema";

export default (iState?: MapSchema<InventoryState>) => {
  const inventoryItems: Array<InventoryItems> = [];
  if (iState) {
    for (let key in iState) {
      const item = iState[key] as InventoryState;
      const { itemId, position, quantity } = item;
      const itemData = itemsData.find((data) => data.id === itemId);
      if (itemData) {
        const { spritesheet, spriteId, name } = itemData;

        inventoryItems[position] = {
          itemId,
          position,
          quantity,
          spritesheet,
          spriteId,
          name,
        };
      }
    }
  }
  return inventoryItems;
};
