import { Entity } from "ecsy";
import Movement from "@client/components/Movement";
import Position from "@client/components/Position";
import NewMovementTarget from "@client/components/NewMovementTarget";
import isWalkable from "../../utilities/TileMap/isWalkable";
import tileInDirection from "../../utilities/TileMap/tileInDirection";
import roundVector from "../../utilities/Vector/roundVector";
import TileMap from "@client/components/TileMap";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";
import getNextTileData from "@client/utilities/TileMap/getNextTileData";
import ChangeMap from "@client/components/ChangeMap";
import gameState from "@client/gameState";

export default (entity: Entity, tileMap: TileMap) => {
  const columns = tileMap.width;
  const rows = tileMap.height;
  const movement = entity.getMutableComponent(Movement);
  const position = entity.getMutableComponent(Position);
  const movementTarget = entity.getComponent(NewMovementTarget);
  const newTarget = movementTarget.targetTile;
  const mapDir = movementTarget.mapDir;

  const roundPosition = roundVector(position.value);
  const currentRoundTile = vectorToTileId(roundPosition, columns);
  const destinationTile = tileIdToVector(newTarget, columns);

  const newTargetNotSameAsCurrent = newTarget !== currentRoundTile;
  const movementDirectionDisabled = !movement.direction;
  const targetNotInDirection =
    newTarget !==
    tileInDirection(movement.currentTile, movement.direction, rows, columns);
  const notAlreadyMovingInTheDirection =
    movement.pathingTo === undefined || movement.pathingTo !== newTarget;
  const tileQueueEmptyOrDestinationIsTheSameAsTarget =
    !movement.tileQueue.length ||
    movement.tileQueue[movement.tileQueue.length - 1] !== newTarget;

  if (
    newTargetNotSameAsCurrent &&
    (movementDirectionDisabled || targetNotInDirection) &&
    notAlreadyMovingInTheDirection &&
    tileQueueEmptyOrDestinationIsTheSameAsTarget &&
    isWalkable(tileMap, newTarget)
  ) {
    movement.pathingTo = newTarget;

    try {
      const path = tileMap.objectTileStore.aStar.findPath(
        roundPosition,
        destinationTile
      );
      if (path.length) {
        movement.tileQueue = path.map((p) => p[0] + p[1] * columns);
        movement.targetTile = newTarget;

        if (mapDir) {
          const { isEdge, compass } = getNextTileData(
            newTarget,
            rows,
            columns,
            mapDir
          );

          if (isEdge) {
            const nextMap = tileMap.properties[compass];
            if (nextMap) {
              gameState.send("map", "localPlayer:movement:walkOff", {
                direction: mapDir,
              });
            }
          }
        }
      }
      movement.pathingTo = undefined;
    } catch (_) {}
  }

  entity.removeComponent(NewMovementTarget);
};
