import InventoryState from "@server/components/inventory";
import { InventoryItems, ItemSpec } from "types/TileMap/ItemTiles";
import { MapSchema } from "@colyseus/schema";

const itemsData = require("utilities/data/items.json") as ItemSpec[];

export default (iState?: MapSchema<InventoryState>) => {
  const inventoryItems: Array<InventoryItems> = [];
  if (iState) {
    for (let key in iState) {
      const item = iState[key] as InventoryState;
      const { itemId, position, quantity } = item;
      const itemData = itemsData.find((data) => data.id === itemId);
      if (itemData) {
        const {
          spritesheet,
          spriteId,
          name,
          type,
          equippable,
          tags,
          damage,
          range,
        } = itemData;
        const { equipped } = item;

        inventoryItems[position] = {
          itemId,
          position,
          quantity,
          spritesheet,
          spriteId,
          name,
          equipped,
          type,
          equippable,
          tags,
          damage,
          range,
        };
      }
    }
  }
  return inventoryItems;
};
