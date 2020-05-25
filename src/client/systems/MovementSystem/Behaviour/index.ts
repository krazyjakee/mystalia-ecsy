import { System, Entity } from "ecsy";
import Enemy, { LookAtPlayer } from "@client/components/Enemy";

export default class BehaviourSystem extends System {
  static queries = {
    enemies: {
      components: [Enemy],
      listen: {
        added: true,
      },
    },
  };

  execute() {
    this.queries.enemies.added?.forEach((entity: Entity) => {
      const enemy = entity.getComponent(Enemy);
      const spec = enemy.spec;
      if (spec) {
        if (spec.behavior.static || spec.behavior.patrol) {
          entity.addComponent(LookAtPlayer);
        }
      }
    });
  }
}
