import { System, Entity, Not } from "ecsy";
import { MouseInput } from "@client/components/Tags";
import { Vector } from "types/TMJ";
import Movement from "@client/components/Movement";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import isWalkable from "../../utilities/TileMap/isWalkable";
import NewMovementTarget from "@client/components/NewMovementTarget";
import { vectorToTileId } from "utilities/tileMap";

export default class MouseInputSystem extends System {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;

  static queries = {
    mouseEnabledEntities: {
      components: [MouseInput, Movement],
    },
    tileMaps: {
      components: [TileMap, Not(Loadable), Drawable],
    },
  };

  init() {
    const rootElem = document.getElementById("click-area");

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
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMap) return;

    const tileMapDrawable = tileMap.getComponent(Drawable);
    const tileMapComponent = tileMap.getComponent(TileMap);

    this.queries.mouseEnabledEntities.results.forEach((entity) => {
      if (!this.clickedPosition) return;
      const offsetClickedPosition = {
        x: this.clickedPosition.x / 32 - tileMapDrawable.offset.x / 32,
        y: this.clickedPosition.y / 32 - tileMapDrawable.offset.y / 32,
      };
      const clickedTile = vectorToTileId(
        offsetClickedPosition,
        tileMapComponent.width
      );

      this.clickedPosition = undefined;

      if (!isWalkable(tileMapComponent, clickedTile)) return;

      entity.addComponent(NewMovementTarget, { targetTile: clickedTile });
    });
  }
}
