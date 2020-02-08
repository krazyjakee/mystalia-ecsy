import { System, Entity } from "ecsy";
import KeyboardInputComponent from "../components/KeyboardInput";
import * as keyboardJS from "keyboardjs";
import { Direction } from "types/Grid";

export default class KeyboardInput extends System {
  static queries = {
    keyboardEnabledEntities: {
      components: [KeyboardInputComponent]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.keyboardEnabledEntities.results.forEach((resource: Entity) => {
      const keyboard = resource.getComponent(KeyboardInputComponent);

      if (keyboard.bound) {
        return;
      }

      const compassKeys: Array<Direction> = ["n", "e", "s", "w"];
      const movementKeys: { [key in Direction]: string[] } = {
        n: ["w", "up"],
        e: ["d", "right"],
        s: ["s", "down"],
        w: ["a", "left"]
      };

      compassKeys.forEach(compassKey => {
        movementKeys[compassKey].forEach(key => {
          keyboardJS.bind(
            key,
            () => {
              keyboard.direction = compassKey;
            },
            () => {
              keyboard.direction = undefined;
            }
          );
        });
      });

      const otherKeys = ["~"];
      otherKeys.forEach(key => {
        keyboardJS.bind(
          key,
          () => {
            keyboard.pressedKeys.push(key);
          },
          () => {
            keyboard.pressedKeys.splice(keyboard.pressedKeys.indexOf(key), 1);
          }
        );
      });
    });
  }
}
