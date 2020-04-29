import { System, Entity } from "ecsy";
import { PickUpAtDestination } from "@client/components/Tags";
import Movement from "@client/components/Movement";
import gameState from "@client/gameState";
import LocalPlayer from "@client/components/LocalPlayer";

export default class PickUpSystem extends System {
  static queries = {
    pickUpAtDestination: {
      components: [PickUpAtDestination, Movement, LocalPlayer],
    },
  };

  execute() {
    this.queries.pickUpAtDestination.results.forEach((entity: Entity) => {
      const movement = entity.getComponent(Movement);
      // don't do anything if we're still moving
      if (movement.tileQueue.length || movement.direction) return;
      gameState.send("map", "localPlayer:inventory:pickup");
      entity.removeComponent(PickUpAtDestination);
    });
  }
}
