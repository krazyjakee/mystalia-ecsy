import { System, Entity } from "ecsy";
import Movement from "@client/components/Movement";
import gameState from "@client/gameState";
import LocalPlayer from "@client/components/LocalPlayer";
import { OpenShopAtDestination } from "@client/components/Shop";
import { isPresent } from "utilities/guards";
import { OpenLootAtDestination } from "@client/components/Loot";

export default class TileActionSystem extends System {
  static queries = {
    shopOpenAtDestination: {
      components: [OpenShopAtDestination, Movement, LocalPlayer],
    },
    lootOpenAtDestination: {
      components: [OpenLootAtDestination, Movement, LocalPlayer],
    },
  };

  execute() {
    this.queries.shopOpenAtDestination.results.forEach((entity: Entity) => {
      const movement = entity.getComponent(Movement);
      if (movement.tileQueue.length || movement.direction) return;
      const { shopId } = entity.getComponent(OpenShopAtDestination);
      if (isPresent(shopId)) {
        gameState.trigger("localPlayer:shop:open", { shopId });
      }
      entity.removeComponent(OpenShopAtDestination);
    });

    this.queries.lootOpenAtDestination.results.forEach((entity: Entity) => {
      const movement = entity.getComponent(Movement);
      if (movement.tileQueue.length || movement.direction) return;
      const { tileId } = entity.getComponent(OpenLootAtDestination);
      if (isPresent(tileId)) {
        gameState.trigger("localPlayer:loot:open", { tileId });
      }
      entity.removeComponent(OpenLootAtDestination);
    });
  }
}
