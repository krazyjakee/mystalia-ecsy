import { System, Entity } from "ecsy";
import Movement from "@client/components/Movement";
import gameState from "@client/gameState";
import LocalPlayer from "@client/components/LocalPlayer";
import { OpenShopAtDestination } from "@client/components/Shop";
import { isPresent } from "utilities/guards";

export default class ShopOpenSystem extends System {
  static queries = {
    shopOpenAtDestination: {
      components: [OpenShopAtDestination, Movement, LocalPlayer],
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
  }
}
