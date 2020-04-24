import { System, Not } from "ecsy";
import { MouseInput, Focused } from "@client/components/Tags";
import { Vector } from "types/TMJ";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import isWalkable from "../../utilities/TileMap/isWalkable";
import NewMovementTarget from "@client/components/NewMovementTarget";
import { vectorToTileId } from "utilities/tileMap";
import { areColliding } from "@client/utilities/Vector/collision";
import addOffset from "@client/utilities/Vector/addOffset";
import Position from "@client/components/Position";
import LocalPlayer from "@client/components/LocalPlayer";
import ChangeMap from "@client/components/ChangeMap";
import { Direction } from "types/Grid";
import getNextTileData from "@client/utilities/TileMap/getNextTileData";

export default class MouseInputSystem extends System {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;

  static queries = {
    localPlayer: {
      components: [MouseInput, LocalPlayer],
    },
    mouseEnabledEntities: {
      components: [MouseInput, Position, Drawable, Not(LocalPlayer)],
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

    this.queries.localPlayer.results.forEach((entity) => {
      this.queries.mouseEnabledEntities.results.forEach((entity) => {
        if (!this.clickedPosition) return;
        const drawable = entity.getComponent(Drawable);
        const { value } = entity.getComponent(Position);
        const isFocused = entity.hasComponent(Focused);

        const enemyPosition = addOffset(
          { x: value.x * 32, y: value.y * 32 },
          tileMapDrawable.offset
        );

        const isClicked = areColliding(
          {
            ...this.clickedPosition,
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

        if (isClicked && !isFocused) {
          entity.addComponent(Focused);
          this.clickedPosition = undefined;
        } else if (!isClicked && isFocused) {
          entity.removeComponent(Focused);
        }
      });

      if (!this.clickedPosition) return;

      const offsetClickedPosition = {
        x: this.clickedPosition.x / 32 - tileMapDrawable.offset.x / 32,
        y: this.clickedPosition.y / 32 - tileMapDrawable.offset.y / 32,
      };

      let mapDir: Direction | undefined;
      if (offsetClickedPosition.y < 0) {
        offsetClickedPosition.y = 0;
        mapDir = "n";
      }
      if (offsetClickedPosition.x < 0) {
        offsetClickedPosition.x = 0;
        mapDir = "w";
      }
      if (offsetClickedPosition.y >= tileMapComponent.height) {
        offsetClickedPosition.y = tileMapComponent.height - 1;
        mapDir = "s";
      }
      if (offsetClickedPosition.x >= tileMapComponent.width) {
        offsetClickedPosition.x = tileMapComponent.width - 1;
        mapDir = "e";
      }

      const clickedTile = vectorToTileId(
        offsetClickedPosition,
        tileMapComponent.width
      );

      if (isWalkable(tileMapComponent, clickedTile)) {
        if (mapDir) {
          const { isEdge, compass } = getNextTileData(
            clickedTile,
            tileMapComponent.height,
            tileMapComponent.width,
            mapDir
          );

          if (isEdge) {
            const nextMap = tileMapComponent.properties[compass];
            if (nextMap) {
              entity.addComponent(ChangeMap, { nextMap, direction: mapDir });
            }
          }
        }

        this.queries.mouseEnabledEntities.results.forEach((entity) => {
          entity.removeComponent(Focused);
        });
        entity.addComponent(NewMovementTarget, { targetTile: clickedTile });
      }

      this.clickedPosition = undefined;
    });
  }
}
