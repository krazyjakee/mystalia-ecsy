import { System, Entity, Not } from "ecsy";
import Movement from "../components/Movement";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import {
  tileIdToVector,
  compassToVector,
  addOffset,
  vectorToTileId
} from "../utilities/TileMap/calculations";
import { getTileFromQueue } from "../utilities/Player/playerMovement";
import Position from "../components/Position";

export default class MovementSystem extends System {
  static queries = {
    movableEntities: {
      components: [Movement, Position]
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)]
    }
  };

  execute(delta: number) {
    const tileMapEntity =
      // @ts-ignore
      this.queries.tileMaps.results.length &&
      // @ts-ignore
      this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;
    const tileMap = (tileMapEntity as Entity).getComponent(TileMap);
    const columns = tileMap.width;

    // @ts-ignore
    this.queries.movableEntities.results.forEach((entity: Entity) => {
      const movement = entity.getMutableComponent(Movement);
      const position = entity.getMutableComponent(Position);

      if (movement.targetTile >= 0) {
        const destinationTile = tileIdToVector(movement.targetTile, columns);
        movement.targetTile = -1;

        tileMap.aStar.findPath(
          position.value.x,
          position.value.y,
          destinationTile.x,
          destinationTile.y,
          path => {
            if (path) {
              movement.tileQueue = path.map(p => p.x + p.y * columns);
            }
          }
        );
        tileMap.aStar.calculate();
      }

      if (!movement.direction && movement.tileQueue.length) {
        movement.direction = getTileFromQueue(movement, columns);
      }

      if (movement.direction) {
        const moveAmount = movement.speed * delta;
        const direction = compassToVector(movement.direction);
        const moveVector = {
          x: direction.x * moveAmount,
          y: direction.y * moveAmount
        };
        const offset = {
          x: (position.value.x + direction.x) % 1,
          y: (position.value.y + direction.y) % 1
        };
        const distance = addOffset(offset, {
          x: -Math.abs(moveVector.x),
          y: -Math.abs(moveVector.y)
        });
        if (distance.x <= 0 && distance.y <= 0) {
          // TODO: if the next in queue is the same direction we should continue moving otherwise this might create jerky movement
          position.value = addOffset(position.value, direction);
          movement.currentTile = vectorToTileId(position.value, columns);
          movement.direction = undefined;
        } else {
          position.value = addOffset(position.value, moveVector);
        }
        console.log(`x: ${position.value.x}, y: ${position.value.y}`);
      }
    });
  }
}
