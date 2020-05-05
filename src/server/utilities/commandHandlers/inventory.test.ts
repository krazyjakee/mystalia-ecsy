import { MapSchema } from "@colyseus/schema";
import InventoryState from "@server/components/inventory";
import { addItemToPlayer } from "./inventory";
import ItemState from "@server/components/item";
import { searchState } from "../colyseusState";

export const createInventoryState = () => {
  const inventoryState = new MapSchema<InventoryState>();
  inventoryState["i0"] = new InventoryState({
    itemId: 0,
    position: 0,
    quantity: 1,
    equipped: false,
  });
  inventoryState["i1"] = new InventoryState({
    itemId: 1,
    position: 1,
    quantity: 10,
    equipped: false,
  });
  return inventoryState;
};

describe("InventoryCommandHandler", () => {
  describe("#addItemToPlayer", () => {
    const inventoryState = createInventoryState();
    test("correctly add new item", () => {
      const newItem = new ItemState(2, 0, 2);
      addItemToPlayer(inventoryState, newItem);

      expect(
        searchState(inventoryState, {
          itemId: 2,
          position: 2,
          quantity: 2,
          equipped: false,
        })
      ).toHaveLength(1);

      expect(Object.keys(inventoryState)).toHaveLength(3);
    });

    test("correctly add existing item", () => {
      const newItem = new ItemState(0, 0, 2);
      addItemToPlayer(inventoryState, newItem);
      expect(
        searchState(inventoryState, {
          itemId: 0,
          position: 0,
          quantity: 3,
          equipped: false,
        })
      ).toHaveLength(1);

      expect(Object.keys(inventoryState)).toHaveLength(3);
    });
  });
});
