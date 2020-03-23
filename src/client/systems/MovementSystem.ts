import { System, Entity, Not } from "ecsy";
import Movement from "../components/Movement";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import {
  tileIdToVector,
  vectorToTileId
} from "../utilities/TileMap/calculations";
import directionFromTile from "../utilities/TileMap/directionFromTile";
import compassToVector from "../utilities/Compass/compassToVector";
import addOffset from "../utilities/Vector/addOffset";
import Position from "../components/Position";
import { SendData } from "../components/Tags";
import isWalkable from "../utilities/TileMap/isWalkable";

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

      const roundPosition = {
        x: Math.round(position.value.x),
        y: Math.round(position.value.y)
      };

      const currentRoundTile = vectorToTileId(roundPosition, columns);

      if (movement.targetTile !== undefined) {
        if (
          isWalkable(tileMap, movement.targetTile) &&
          // don't set a new destination if we're already there or going there
          movement.targetTile !== currentRoundTile &&
          (!movement.direction ||
            movement.targetTile !=
              vectorToTileId(
                addOffset(
                  tileIdToVector(movement.currentTile, columns),
                  compassToVector(movement.direction)
                ),
                columns
              )) &&
          (!movement.pathingTo || movement.pathingTo != movement.targetTile) &&
          (!movement.tileQueue.length ||
            movement.tileQueue[movement.tileQueue.length - 1] !==
              movement.targetTile)
        ) {
          let foundDestination = false;
          if (!foundDestination) {
            const destinationTile = tileIdToVector(
              movement.targetTile,
              columns
            );
            movement.pathingTo = movement.targetTile;
            tileMap.aStar.findPath(
              roundPosition.x,
              roundPosition.y,
              destinationTile.x,
              destinationTile.y,
              path => {
                if (path) {
                  movement.tileQueue = path.map(p => p.x + p.y * columns);
                }
                movement.pathingTo = undefined;
              }
            );
            tileMap.aStar.calculate();
          }
        }

        movement.targetTile = undefined;
      }

      const setDirection = () => {
        if (!movement.direction && movement.tileQueue.length) {
          while (!movement.direction && movement.tileQueue.length) {
            const nextTile = movement.tileQueue.shift();
            if (nextTile && nextTile !== currentRoundTile) {
              movement.direction = directionFromTile(
                currentRoundTile,
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
          if (nextDirection && movement.direction === nextDirection) {
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
