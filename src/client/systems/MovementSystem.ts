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
import {
  directionFromTile,
  compassDirections
} from "../utilities/Movement/movement";
import Position from "../components/Position";
import { Direction } from "types/Grid";

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
        // do a simple check to see if our destination is within 1 tile
        // TODO: there's probably a more mathematical way to calculate the direction than looping through them all until we find the corresponding one
        for (const direction of compassDirections) {
          const vector = compassToVector(direction);
          const tileInDirection = vectorToTileId(
            addOffset(position.value, vector),
            columns
          );
          if (tileInDirection === movement.targetTile) {
            const obj = tileMap.objectTileStore.get(tileInDirection);
            if (!obj || obj.type !== "block") movement.direction = direction; // collision check!
            break;
          }
        }

        // if not we should use pathfinding
        if (!movement.direction) {
          const destinationTile = tileIdToVector(movement.targetTile, columns);
          tileMap.aStar.findPath(
            Math.floor(position.value.x),
            Math.floor(position.value.y),
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

        movement.targetTile = -1;
      }

      if (!movement.direction && movement.tileQueue.length) {
        while (!movement.direction && movement.tileQueue.length) {
          const nextTile = movement.tileQueue.shift();
          if (nextTile && nextTile !== movement.currentTile) {
            movement.direction = directionFromTile(
              movement.currentTile,
              nextTile,
              columns
            );
          }
        }
      }

      if (movement.direction) {
        const moveAmount = movement.speed * (delta / 1000);
        const direction = compassToVector(movement.direction);
        const moveVector = {
          x: direction.x * moveAmount,
          y: direction.y * moveAmount
        };
        const currentVector = tileIdToVector(movement.currentTile, columns);
        const distance = {
          // calculate how far we are from the next tile
          x:
            (currentVector.x +
              direction.x -
              (position.value.x + moveVector.x)) *
            direction.x,
          y:
            (currentVector.y +
              direction.y -
              (position.value.y + moveVector.y)) *
            direction.y
        };
        if (distance.x <= 0 && distance.y <= 0) {
          // TODO: if the next in queue is the same direction we should continue moving otherwise this might create jerky movement
          position.value = {
            // we have to do currentVector + direction instead of using distance otherwise floating point errors mess stuff up
            x: direction.x ? currentVector.x + direction.x : position.value.x,
            y: direction.y ? currentVector.y + direction.y : position.value.y
          };
          position.value = addOffset(currentVector, direction);
          movement.currentTile = vectorToTileId(position.value, columns);
          movement.direction = undefined;
          if (!movement.tileQueue.length) {
            movement.moving = false;
          }
        } else {
          position.value = addOffset(position.value, moveVector);
        }
      }
    });
  }
}
