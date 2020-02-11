import { System, Entity, Not } from "ecsy";
import KeyboardInput from "../../components/KeyboardInput";
import PlayerComponent from "../../components/Player";
import { Loadable } from "../../components/Loadable";
import { Direction } from "types/Grid";

export default class PlayerKeyboardInput extends System {
  static queries = {
    player: {
      components: [Not(Loadable), PlayerComponent, KeyboardInput]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.player.results.forEach((playerEntity: Entity) => {
      const player = playerEntity.getComponent(PlayerComponent);
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
            player.direction = compassKey;
            directionPressed = true;
          }
        });
      });

      if (!directionPressed) {
        player.direction = undefined;
      } else {
        player.previousDirection = player.direction;
      }
    });
  }
}
