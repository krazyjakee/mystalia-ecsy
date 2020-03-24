import { System, Entity, Not } from "ecsy";
import Movement from "../../components/Movement";
import TileMap from "../../components/TileMap";
import { Loadable } from "../../components/Loadable";
import {
  tileIdToVector,
  vectorToTileId
} from "../../utilities/TileMap/calculations";
import directionFromTile from "../../utilities/TileMap/directionFromTile";
import compassToVector from "../../utilities/Compass/compassToVector";
import addOffset from "../../utilities/Vector/addOffset";
import Position from "../../components/Position";
import { SendData } from "../../components/Tags";
import NewMovementTarget from "../../components/NewMovementTarget";
import roundVector from "../../utilities/Vector/roundVector";
import awaitingTarget from "./awaitingTarget";

export default class MovementSystem extends System {
  static queries = {
    movableEntities: {
      components: [Movement, Position]
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)]
    },
    awaitingTarget: {
      components: [Movement, Position, NewMovementTarget]
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

    // @ts-ignore
    this.queries.awaitingTarget.results.forEach((entity: Entity) => {
      awaitingTarget(entity, tileMap);
    });

    const columns = tileMap.width;
    // @ts-ignore
    this.queries.movableEntities.results.forEach((entity: Entity) => {
      const movement = entity.getMutableComponent(Movement);
      const position = entity.getMutableComponent(Position);

      const roundPosition = roundVector(position.value);
      const currentRoundTile = vectorToTileId(roundPosition, columns);

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
        const nextPosition = addOffset(currentVector, direction);
        const distance = {
          // calculate how far we are from the next tile
          x: (nextPosition.x - (position.value.x + moveVector.x)) * direction.x,
          y: (nextPosition.y - (position.value.y + moveVector.y)) * direction.y
        };

        if (distance.x <= 0 && distance.y <= 0) {
          const nextTarget = movement.tileQueue.length
            ? movement.tileQueue[0]
            : undefined;

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