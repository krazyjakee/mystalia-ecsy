import { System, Entity, Not } from "ecsy";
import Movement from "@client/components/Movement";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import directionFromTile from "../../utilities/TileMap/directionFromTile";
import compassToVector from "../../utilities/Compass/compassToVector";
import addOffset from "../../utilities/Vector/addOffset";
import Position from "@client/components/Position";
import { SendData, Disable } from "@client/components/Tags";
import NewMovementTarget from "@client/components/NewMovementTarget";
import roundVector from "../../utilities/Vector/roundVector";
import awaitingTarget from "./awaitingTarget";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";

export default class MovementSystem extends System {
  static queries = {
    movableEntities: {
      components: [Not(Disable), Movement, Position],
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    awaitingTarget: {
      components: [Movement, Position, NewMovementTarget],
    },
  };

  execute(delta: number) {
    const tileMapEntity =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;
    const tileMap = (tileMapEntity as Entity).getComponent(TileMap);

    this.queries.awaitingTarget.results.forEach((entity) => {
      awaitingTarget(entity, tileMap);
    });

    const columns = tileMap.width;

    this.queries.movableEntities.results.forEach((entity) => {
      const movement = entity.getMutableComponent(Movement);
      const position = entity.getMutableComponent(Position);

      const roundPosition = roundVector(position.value);
      const currentRoundTile = vectorToTileId(roundPosition, columns);

      const setDirection = () => {
        if (!movement.direction && movement.tileQueue.length) {
          while (!movement.direction && movement.tileQueue.length) {
            const nextTile = movement.tileQueue.shift();
            if (nextTile !== undefined && nextTile !== currentRoundTile) {
              movement.direction = directionFromTile(
                currentRoundTile,
                nextTile,
                columns
              );
              if (!entity.hasComponent(SendData)) {
                entity.addComponent(SendData);
              }
            }
          }
        }
      };

      setDirection();

      if (movement.direction) {
        let moveAmount = movement.speed * (delta / 1000);
        while (moveAmount > 0 && movement.direction) {
          const currentMoveAmount = Math.min(moveAmount, 1);
          moveAmount -= currentMoveAmount;
          const direction = compassToVector(movement.direction);
          const moveVector = {
            x: direction.x * currentMoveAmount,
            y: direction.y * currentMoveAmount,
          };
          const currentVector = tileIdToVector(movement.currentTile, columns);
          const nextPosition = addOffset(currentVector, direction);
          const distance = {
            // calculate how far we are from the next tile
            x:
              (nextPosition.x - (position.value.x + moveVector.x)) *
              direction.x,
            y:
              (nextPosition.y - (position.value.y + moveVector.y)) *
              direction.y,
          };
          const nextId = vectorToTileId(nextPosition, columns);

          if (distance.x <= 0 && distance.y <= 0) {
            const nextTarget = movement.tileQueue.length
              ? movement.tileQueue[0]
              : undefined;

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
          } else if (tileMap.objectTileStore.blockList.includes(nextId)) {
            movement.direction = undefined;
          } else {
            position.value = addOffset(position.value, moveVector);
          }

          setDirection();
        }
      }
    });
  }
}
