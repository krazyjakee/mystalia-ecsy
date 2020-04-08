import { System, Entity, Not } from "ecsy";
import { KeyboardInput } from "../../components/Tags";
import Movement from "../../components/Movement";
import Position from "../../components/Position";
import TileMap from "../../components/TileMap";
import { Direction } from "types/Grid";
import { Loadable } from "../../components/Loadable";
import { compassDirections } from "../../utilities/Compass/compassDirections";
import tileInDirection from "../../utilities/TileMap/tileInDirection";
import roundVector from "../../utilities/Vector/roundVector";
import NewMovementTarget from "../../components/NewMovementTarget";
import { vectorToTileId } from "utilities/tileMap";
import gameState from "../../gameState";
import getNextTileData from "../../utilities/TileMap/getNextTileData";
import ChangeMap from "../../components/ChangeMap";
import { StaticQuery } from "types/ecsy";

const movementKeys: { [key in Direction]: string[] } = {
  n: ["KeyW", "ArrowUp"],
  e: ["KeyD", "ArrowRight"],
  s: ["KeyS", "ArrowDown"],
  w: ["KeyA", "ArrowLeft"],
};

export default class KeyboardInputSystem extends System {
  pressedKeys: string[] = [];
  enabled: boolean = true;

  static queries: StaticQuery = {
    keyboardEnabledEntities: {
      components: [KeyboardInput, Movement, Position],
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
  };

  init() {
    document.addEventListener(
      "keydown",
      (e) => {
        const key = e.code;
        if (!this.pressedKeys.includes(key) && !e.repeat) {
          this.pressedKeys.push(key);
        }
      },
      false
    );
    document.addEventListener(
      "keyup",
      (e) => {
        const key = e.code;
        this.pressedKeys.splice(this.pressedKeys.indexOf(key), 1);
      },
      false
    );
  }

  execute() {
    const tileMap =
      this.queries.tileMaps.results.length &&
      this.queries.tileMaps.results[0].getComponent(TileMap);
    if (!tileMap) return;
    const rows = tileMap.height;
    const columns = tileMap.width;

    this.queries.keyboardEnabledEntities.results.forEach((entity) => {
      let direction;

      compassDirections.forEach((compassKey) => {
        movementKeys[compassKey].forEach((key) => {
          if (this.pressedKeys.includes(key)) {
            direction = compassKey;
          }
        });
      });

      if (direction) {
        const position = entity.getComponent(Position);
        const movement = entity.getComponent(Movement);
        const target = tileInDirection(
          vectorToTileId(roundVector(position.value), columns),
          direction,
          rows,
          columns
        );

        if (target === undefined) {
          const { isEdge, compass } = getNextTileData(
            movement.currentTile,
            rows,
            columns,
            direction
          );

          if (isEdge) {
            const nextMap = tileMap.properties[compass];
            if (nextMap) {
              entity.addComponent(ChangeMap, { nextMap, direction });
            }
          }
        }

        entity.addComponent(NewMovementTarget, { targetTile: target });
      } else if (this.pressedKeys.includes("KeyE")) {
        gameState.send("map", "localPlayer:inventory:pickup");
        this.pressedKeys.splice(this.pressedKeys.indexOf("KeyE"), 1);
      }
    });
  }
}
