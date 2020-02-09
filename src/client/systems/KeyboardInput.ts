import { System, Entity } from "ecsy";
import KeyboardInputComponent from "../components/KeyboardInput";

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

      document.addEventListener(
        "keydown",
        e => {
          const key = e.key;
          if (!keyboard.pressedKeys.includes(key)) {
            keyboard.pressedKeys.push(key);
          }
        },
        false
      );
      document.addEventListener(
        "keyup",
        e => {
          const key = e.key;
          keyboard.pressedKeys.splice(keyboard.pressedKeys.indexOf(key), 1);
        },
        false
      );
    });
  }
}
