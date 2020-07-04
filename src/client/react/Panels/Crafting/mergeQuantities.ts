import { InventoryItems } from "types/TileMap/ItemTiles";

export default (items: InventoryItems[]) => {
  const mergedItems: InventoryItems[] = [];
  items.forEach((item) => {
    let existingIndex = mergedItems.findIndex((i) => i.itemId === item.itemId);
    if (existingIndex > -1) {
      mergedItems[existingIndex].quantity += item.quantity;
    } else {
      mergedItems.push(item);
    }
  });
  return mergedItems;
};
