import { System, Not, Entity } from "ecsy";
import {
  MouseInput,
  Focused,
  PickUpAtDestination,
  BattleTarget,
} from "@client/components/Tags";
import { Vector } from "types/TMJ";
import TileMap, { ChangingMap } from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import isWalkable from "../../utilities/TileMap/isWalkable";
import NewMovementTarget from "@client/components/NewMovementTarget";
import { vectorToTileId, pixelsToTileId } from "utilities/tileMap";
import addOffset from "@client/utilities/Vector/addOffset";
import Position from "@client/components/Position";
import LocalPlayer from "@client/components/LocalPlayer";
import { Direction } from "types/Grid";
import { OpenShopAtDestination } from "@client/components/Shop";
import { findClosestPath } from "utilities/movement/surroundings";
import Movement from "@client/components/Movement";
import Enemy from "@client/components/Enemy";
import { areColliding } from "utilities/math";
import { isPresent } from "utilities/guards";
import getNextTileData from "@client/utilities/TileMap/getNextTileData";
import gameState from "@client/gameState";
import { OpenLootAtDestination } from "@client/components/Loot";

export default class MouseInputSystem extends System {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;
  doubleClicked: boolean = false;

  static queries = {
    localPlayer: {
      components: [MouseInput, LocalPlayer, Not(ChangingMap)],
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
      this.doubleClicked = false;
    };

    const mouseDown = (e: MouseEvent) => {
      this.mouseDownPosition = { x: e.x, y: e.y };
    };

    const mouseUp = () => {
      this.mouseDownPosition = undefined;
    };

    const doubleClick = () => {
      this.doubleClicked = true;
    };

    if (rootElem) {
      rootElem.addEventListener("mousemove", mouseMove);
      rootElem.addEventListener("click", click);
      rootElem.addEventListener("mousedown", mouseDown);
      rootElem.addEventListener("mouseup", mouseUp);
      rootElem.addEventListener("dblclick", doubleClick);
    }
  }

  execute() {
    if (window.disableMovement) {
      this.clickedPosition = undefined;
      return;
    }

    const tileMap =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMap) return;

    const tileMapDrawable = tileMap.getComponent(Drawable);
    const tileMapComponent = tileMap.getComponent(TileMap);

    this.queries.localPlayer.results.forEach((playerEntity) => {
      let entityClicked = false;
      let targetTile: number | undefined;

      this.queries.mouseEnabledEntities.results.forEach((entity) => {
        if (!this.clickedPosition) return;
        const drawable = entity.getComponent(Drawable);
        const { value } = entity.getComponent(Position);
        const enemy = entity.getComponent(Enemy);
        const isFocused = entity.hasComponent(Focused);
        const isBattleTarget = entity.hasComponent(BattleTarget);

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
          }
        );

        if (enemy && isClicked) {
          if (this.doubleClicked && enemy && !isBattleTarget) {
            entity.addComponent(BattleTarget);
            entity.removeComponent(Focused);
            entityClicked = true;
          } else if (!isFocused) {
            if (enemy.spec && isPresent(enemy.spec.shopId)) {
              playerEntity.addComponent(OpenShopAtDestination, {
                shopId: enemy.spec.shopId,
              });
              const movement = playerEntity.getComponent(Movement);
              const closestPath = findClosestPath(
                tileMapComponent.objectTileStore,
                movement.currentTile,
                pixelsToTileId(value, tileMapComponent.width)
              );
              targetTile = closestPath?.pop();
            } else {
              entity.addComponent(Focused);
              entityClicked = true;
            }
          }
        } else if (enemy && !isClicked) {
          if (isFocused) {
            entity.removeComponent(Focused);
          }
          if (isBattleTarget) {
            entity.removeComponent(BattleTarget);
          }
        }
      });

      if (entityClicked) {
        this.clickedPosition = undefined;
      }

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

      const clickedTileObjects = tileMapComponent.objectTileStore.get(
        clickedTile
      );

      if (!targetTile && isWalkable(tileMapComponent, clickedTile)) {
        targetTile = clickedTile;
      }

      if (!targetTile && clickedTileObjects && clickedTileObjects.length) {
        clickedTileObjects.forEach((tileObject) => {
          if (["gate", "loot"].includes(tileObject.type)) {
            if (tileObject.type === "shop") {
              const { shopId } = tileObject.value;
              if (isPresent(shopId)) {
                playerEntity.addComponent(OpenShopAtDestination, { shopId });
              }
            } else if (tileObject.type === "loot") {
              playerEntity.addComponent(OpenLootAtDestination, {
                tileId: clickedTile,
              });
            }

            const movement = playerEntity.getComponent(Movement);
            const closestPath = findClosestPath(
              tileMapComponent.objectTileStore,
              movement.currentTile,
              clickedTile
            );
            targetTile = closestPath?.pop();
          }
        });
      }

      if (targetTile) {
        const movement = playerEntity.getComponent(Movement);
        if (targetTile === movement.currentTile) {
          const isEdge = getNextTileData(
            movement.currentTile,
            tileMapComponent.height,
            tileMapComponent.width,
            mapDir
          );

          if (isEdge) {
            playerEntity.addComponent(ChangingMap);
            gameState.send("map", "localPlayer:movement:walkOff", {
              direction: mapDir,
            });
          }
        } else {
          this.queries.mouseEnabledEntities.results.forEach((entity) => {
            entity.removeComponent(Focused);
          });
          playerEntity.addComponent(NewMovementTarget, {
            targetTile,
            mapDir,
          });
          if (this.doubleClicked)
            playerEntity.addComponent(PickUpAtDestination);
        }
      }

      this.clickedPosition = undefined;
    });
  }
}
