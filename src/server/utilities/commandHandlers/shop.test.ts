import { createInventoryState } from "./inventory.test";
import { canPerformTrade, performTrade } from "./shop";
import InventoryState from "@server/components/inventory";

describe("ShopCommandHandler", () => {
  describe("#canPerformTrade", () => {
    const inventoryState = createInventoryState();
    test("should pass if the player has enough items for the trade", () => {
      const valid = canPerformTrade(inventoryState, {
        buy: 1,
        buyAmount: 5,
        sell: 5,
        sellAmount: 1,
      });
      expect(valid).toBeTruthy();
    });

    test("should fail if the player does not have enough items for the trade", () => {
      const valid = canPerformTrade(inventoryState, {
        buy: 1,
        buyAmount: 15,
        sell: 5,
        sellAmount: 1,
      });
      expect(valid).toBeFalsy();
    });

    test("should fail if the player does not have any of the item", () => {
      const valid = canPerformTrade(inventoryState, {
        buy: 5,
        buyAmount: 1,
        sell: 5,
        sellAmount: 1,
      });
      expect(valid).toBeFalsy();
    });
  });

  describe("#performTrade", () => {
    test("should add the bought item to the inventory and remove the sold item", () => {
      const inventoryState = createInventoryState();
      performTrade(inventoryState, {
        sell: 6,
        sellAmount: 1,
        buy: 0,
        buyAmount: 1,
      });
      expect(inventoryState["i0"]).toStrictEqual(
        new InventoryState({ itemId: 6, position: 0, quantity: 1 })
      );
    });

    test("should add the bought item to the inventory and reduce the quantity of item in inventory", () => {
      const inventoryState = createInventoryState();
      performTrade(inventoryState, {
        sell: 6,
        sellAmount: 1,
        buy: 1,
        buyAmount: 5,
      });
      expect(inventoryState["i2"]).toStrictEqual(
        new InventoryState({ itemId: 6, position: 2, quantity: 1 })
      );
      expect(inventoryState["i1"]).toStrictEqual(
        new InventoryState({ itemId: 1, position: 1, quantity: 5 })
      );
    });

    test("should add the bought item to the inventory, delete and reduce item in inventory", () => {
      const inventoryState = createInventoryState();
      inventoryState["i2"] = new InventoryState({
        itemId: 1,
        position: 2,
        quantity: 10,
      });

      performTrade(inventoryState, {
        sell: 6,
        sellAmount: 1,
        buy: 1,
        buyAmount: 18,
      });

      expect(inventoryState["i1"]).toStrictEqual(
        new InventoryState({ itemId: 6, position: 1, quantity: 1 })
      );
      expect(inventoryState["i2"]).toStrictEqual(
        new InventoryState({ itemId: 1, position: 2, quantity: 2 })
      );
      expect(Object.keys(inventoryState).length).toBe(3);
    });
  });
});
