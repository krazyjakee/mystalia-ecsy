import { System } from "ecsy";
import LocalPlayer from "@client/components/LocalPlayer";
import gameState from "@client/gameState";
import inventoryStateToArray from "@client/react/Panels/Inventory/inventoryStateToArray";
import { InventoryItems } from "types/TileMap/ItemTiles";
import Inventory from "@client/components/Inventory";

export default class InventorySystem extends System {
  localPlayerInventory: InventoryItems[] = [];

  static queries = {
    localPlayer: {
      components: [LocalPlayer],
    },
  };

  init() {
    gameState.subscribe("localPlayer:inventory:response", (inventoryState) => {
      this.localPlayerInventory = inventoryStateToArray(inventoryState);
    });
  }

  execute() {
    if (this.localPlayerInventory.length) {
      const localPlayerEntity =
        this.queries.localPlayer.results.length &&
        this.queries.localPlayer.results[0];
      if (!localPlayerEntity) return;

      const inventory = localPlayerEntity.getMutableComponent(Inventory);
      inventory.inventory = this.localPlayerInventory;
      this.localPlayerInventory = [];
    }
  }
}
