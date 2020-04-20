import { System, Not } from "ecsy";
import { MouseInput, MouseListener } from "@client/components/Tags";
import { Vector } from "types/TMJ";
import Movement from "@client/components/Movement";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import isWalkable from "../../utilities/TileMap/isWalkable";
import NewMovementTarget from "@client/components/NewMovementTarget";
import { vectorToTileId } from "utilities/tileMap";
import { areColliding } from "@client/utilities/Vector/collision";
import addOffset from "@client/utilities/Vector/addOffset";
import config from "@client/config.json";
import Position from "@client/components/Position";
import { MouseIsOver } from "@client/components/MouseIs";

const { allowableOffMapDistance } = config;

export default class MouseInputSystem extends System {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;

  static queries = {
    mouseEnabledEntities: {
      components: [MouseInput, Movement],
    },
    mouseHoverEntities: {
      components: [MouseListener, Position, Drawable],
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

    this.queries.mouseHoverEntities.results.forEach((entity) => {
      const drawable = entity.getComponent(Drawable);
      const { value } = entity.getComponent(Position);
      const isMousedOver = entity.hasComponent(MouseIsOver);

      const enemyPosition = addOffset(
        { x: value.x * 32, y: value.y * 32 },
        tileMapDrawable.offset
      );

      if (this.cursorPosition) {
        const mouseOver = areColliding(
          {
            ...this.cursorPosition,
            width: 1,
            height: 1,
          },
          {
            ...enemyPosition,
            width: drawable.width,
            height: drawable.height,
          },
          tileMapDrawable.offset
        );

        if (mouseOver && !isMousedOver) {
          entity.addComponent(MouseIsOver, { position: this.cursorPosition });
        } else if (!mouseOver && isMousedOver)
          entity.removeComponent(MouseIsOver);
      }
    });
  }
}
