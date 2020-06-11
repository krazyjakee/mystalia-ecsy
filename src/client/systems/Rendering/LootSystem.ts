import { System } from "ecsy";
import NetworkRoom from "@client/components/NetworkRoom";
import Loot, { UpdateLoot } from "@client/components/Loot";

export default class LootSystem extends System {
  static queries = {
    lootUpdates: {
      components: [NetworkRoom, UpdateLoot],
    },
    loot: {
      components: [Loot],
    },
  };

  execute() {
    this.queries.lootUpdates.results.forEach((lootUpdateEntity) => {
      const lootUpdate = lootUpdateEntity.getComponent(UpdateLoot);

      const loot = this.queries.loot.results.find((lootEntity) => {
        const lootComponent = lootEntity.getComponent(Loot);
        return lootComponent.tileId === lootUpdate.tileId;
      });

      if (loot) {
        if (!lootUpdate.items.length) {
          loot.remove();
        } else {
          const lootComponent = loot.getComponent(Loot);
          lootComponent.items = lootUpdate.items;
        }
      }

      lootUpdateEntity.remove();
    });
  }
}
