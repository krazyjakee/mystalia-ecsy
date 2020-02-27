import { System, Entity, Not } from "ecsy";
import { MouseInput, SendData } from "../../components/Tags";
import { Vector } from "types/Grid";
import Movement from "../../components/Movement";
import TileMap from "../../components/TileMap";
import { Loadable } from "../../components/Loadable";
import Drawable from "../../components/Drawable";
import { vectorToTileId } from "../../utilities/TileMap/calculations";

export default class MouseInputSystem extends System {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;

  static queries = {
    mouseEnabledEntities: {
      components: [MouseInput, Movement]
    },
    tileMaps: {
      components: [TileMap, Not(Loadable), Drawable]
    }
  };

  init() {
    const rootElem = document.getElementById("react-root");

    const mouseMove = (e: MouseEvent) => {
      this.cursorPosition = { x: e.x, y: e.y };
    };

    const click = (e: MouseEvent) => {
      this.clickedPosition = { x: e.x, y: e.y };
    };

    const mouseDown = (e: MouseEvent) => {
      this.mouseDownPosition = { x: e.x, y: e.y };
    };

    const mouseUp = () => {
      this.mouseDownPosition = undefined;
    };

    if (rootElem) {
      rootElem.addEventListener("mousemove", mouseMove);
      rootElem.addEventListener("click", click);
      rootElem.addEventListener("mousedown", mouseDown);
      rootElem.addEventListener("mouseup", mouseUp);
    }
  }

  execute() {
    if (!this.clickedPosition) return;

    const tileMap =
      // @ts-ignore
      this.queries.tileMaps.results.length &&
      // @ts-ignore
      this.queries.tileMaps.results[0];
    if (!tileMap) return;

    const tileMapDrawable = tileMap.getComponent(Drawable);
    const tileMapComponent = tileMap.getComponent(TileMap);

    // @ts-ignore
    this.queries.mouseEnabledEntities.results.forEach((entity: Entity) => {
      if (!this.clickedPosition) return;
      const movement = entity.getMutableComponent(Movement);
      const offsetClickedPosition = {
        x: this.clickedPosition.x / 32 - tileMapDrawable.offset.x,
        y: this.clickedPosition.y / 32 - tileMapDrawable.offset.y
      };
      const clickedTile = vectorToTileId(
        offsetClickedPosition,
        tileMapComponent.width
      );
      movement.targetTile = clickedTile;
      entity.addComponent(SendData);
      this.clickedPosition = undefined;
    });
  }
}
