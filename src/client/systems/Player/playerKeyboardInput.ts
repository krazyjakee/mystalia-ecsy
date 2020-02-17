import { System, Entity, Not } from "ecsy";
import KeyboardInput from "../../components/KeyboardInput";
import Movement from "../../components/Movement";
import { Loadable } from "../../components/Loadable";
import { SendData } from "../../components/Tags";
import { Direction } from "types/Grid";

export default class PlayerKeyboardInput extends System {
  static queries = {
    player: {
      components: [Not(Loadable), Movement, KeyboardInput]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.player.results.forEach((playerEntity: Entity) => {
      const movement = playerEntity.getComponent(Movement);
      const keyboardInput = playerEntity.getComponent(KeyboardInput);

      const compassKeys: Array<Direction> = ["n", "e", "s", "w"];
      const movementKeys: { [key in Direction]: string[] } = {
        n: ["w", "up"],
        e: ["d", "right"],
        s: ["s", "down"],
        w: ["a", "left"]
      };

      let directionPressed = false;

      compassKeys.forEach(compassKey => {
        movementKeys[compassKey].forEach(key => {
          if (keyboardInput.pressedKeys.includes(key)) {
            movement.direction = compassKey;
            directionPressed = true;
          }
        });
      });

      if (!directionPressed) {
        movement.direction = undefined;
      } else {
        movement.previousDirection = movement.direction;
        playerEntity.addComponent(SendData); // tell the networking system we need to send this entity's data
      }
    });
  }
}
