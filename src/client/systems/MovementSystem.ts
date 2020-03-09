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
import { SendData } from "../components/Tags";

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

      if (movement.targetTile !== undefined) {
        let foundDestination = false;
        const roundPosition = {
          x: Math.round(position.value.x),
          y: Math.round(position.value.y)
        };
        // do a simple check to see if our destination is within 1 tile
        // TODO: there's probably a more mathematical way to calculate the direction than looping through them all until we find the corresponding one
        for (const direction of compassDirections) {
          const vector = compassToVector(direction);
          const tileInDirection = vectorToTileId(
            addOffset(roundPosition, vector),
            columns
          );
          if (tileInDirection === movement.targetTile) {
            const obj = tileMap.objectTileStore.get(tileInDirection);
            if (!obj || obj.type !== "block") {
              // collision check!
              movement.tileQueue = [tileInDirection];
              //movement.direction = direction;
              foundDestination = true;
            }
            break;
          }
        }

        // if not we should use pathfinding
        if (!foundDestination) {
          const destinationTile = tileIdToVector(movement.targetTile, columns);
          tileMap.aStar.findPath(
            roundPosition.x,
            roundPosition.y,
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

        movement.targetTile = undefined;
      }

      const setDirection = () => {
        if (!movement.direction && movement.tileQueue.length) {
          while (!movement.direction && movement.tileQueue.length) {
            const nextTile = movement.tileQueue.shift();
            if (nextTile && nextTile !== movement.currentTile) {
              movement.direction = directionFromTile(
                movement.currentTile,
                nextTile,
                columns
              );
              entity.addComponent(SendData);
            }
          }
        }
      };

      setDirection();

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
          const nextTarget = movement.tileQueue.length
            ? movement.tileQueue[0]
            : undefined;
          const nextPosition = addOffset(currentVector, direction);
          const nextId = vectorToTileId(nextPosition, columns);
          const nextDirection = nextTarget
            ? directionFromTile(nextId, nextTarget, columns)
            : undefined;
          if (movement.direction === nextDirection) {
            // if we're moving in the same direction we can keep moving
            position.value = addOffset(position.value, moveVector);
          } else {
            position.value = nextPosition;
          }
          movement.currentTile = nextId;
          movement.direction = undefined;
        } else {
          position.value = addOffset(position.value, moveVector);
        }
      }

      setDirection();
    });
  }
}
