import { System, Entity } from "ecsy";
import MouseInputComponent from "../components/MouseInput";

export default class MouseInput extends System {
  static queries = {
    mouseEnabledEntities: {
      components: [MouseInputComponent]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.mouseEnabledEntities.results.forEach((resource: Entity) => {
      const mouse = resource.getComponent(MouseInputComponent);

      if (mouse.bound) {
        return;
      }

      mouse.bound = true;
      const rootElem = document.getElementById("react-root");

      const mouseMove = (e: MouseEvent) => {
        mouse.cursorPosition = { x: e.x, y: e.y };
      };

      const click = (e: MouseEvent) => {
        mouse.clickedPosition = { x: e.x, y: e.y };
      };

      const mouseDown = (e: MouseEvent) => {
        mouse.mouseDownPosition = { x: e.x, y: e.y };
      };

      const mouseUp = () => {
        mouse.mouseDownPosition = undefined;
      };

      if (rootElem) {
        rootElem.addEventListener("mousemove", mouseMove);
        rootElem.addEventListener("click", click);
        rootElem.addEventListener("mousedown", mouseDown);
        rootElem.addEventListener("mouseup", mouseUp);
      }
    });
  }
}
