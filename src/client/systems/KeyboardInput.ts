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

      keyboard.bound = true;

      const keys = ["a", "s", "w", "d", "~"];
      keys.forEach(key => {
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
