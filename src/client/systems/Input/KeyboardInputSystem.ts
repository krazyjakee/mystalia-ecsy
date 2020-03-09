import { System, Entity, Not } from "ecsy";
import { KeyboardInput } from "../../components/Tags";
import Movement from "../../components/Movement";
import Position from "../../components/Position";
import TileMap from "../../components/TileMap";
import { Direction } from "types/Grid";
import { vectorToTileId } from "../../utilities/TileMap/calculations";
import { Loadable } from "../../components/Loadable";
import { compassDirections } from "../../utilities/Compass/compassDirections";
import compassToVector from "../../utilities/Compass/compassToVector";
import addOffset from "../../utilities/Vector/addOffset";

const movementKeys: { [key in Direction]: string[] } = {
  n: ["KeyW", "ArrowUp"],
  e: ["KeyD", "ArrowRight"],
  s: ["KeyS", "ArrowDown"],
  w: ["KeyA", "ArrowLeft"]
};

export default class KeyboardInputSystem extends System {
  pressedKeys: string[] = [];
  enabled: boolean = true;

  static queries = {
    keyboardEnabledEntities: {
      components: [KeyboardInput, Movement, Position]
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)]
    }
  };

  init() {
    document.addEventListener(
      "keydown",
      e => {
        const key = e.code;
        if (!this.pressedKeys.includes(key)) {
          this.pressedKeys.push(key);
        }
      },
      false
    );
    document.addEventListener(
      "keyup",
      e => {
        const key = e.code;
        this.pressedKeys.splice(this.pressedKeys.indexOf(key), 1);
      },
      false
    );
  }

  execute() {
    const tileMap =
      // @ts-ignore
      this.queries.tileMaps.results.length &&
      // @ts-ignore
      this.queries.tileMaps.results[0].getComponent(TileMap);
    if (!tileMap) return;
    // @ts-ignore
    this.queries.keyboardEnabledEntities.results.forEach((entity: Entity) => {
      const movement = entity.getMutableComponent(Movement);

      let direction;

      compassDirections.forEach(compassKey => {
        movementKeys[compassKey].forEach(key => {
          if (this.pressedKeys.includes(key)) {
            direction = compassToVector(compassKey);
          }
        });
      });

      if (direction) {
        const position = entity.getComponent(Position);
        movement.targetTile = vectorToTileId(
          addOffset(
            {
              x: Math.round(position.value.x),
              y: Math.round(position.value.y)
            },
            direction
          ),
          tileMap.width
        );
      }
    });
  }
}
