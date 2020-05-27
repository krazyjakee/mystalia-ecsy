import { Entity } from "ecsy";
import Movement from "@client/components/Movement";
import Position from "@client/components/Position";
import NewMovementTarget from "@client/components/NewMovementTarget";
import isWalkable from "../../utilities/TileMap/isWalkable";
import tileInDirection from "../../utilities/TileMap/tileInDirection";
import roundVector from "../../utilities/Vector/roundVector";
import TileMap, { ChangeMap } from "@client/components/TileMap";
import { vectorToTileId } from "utilities/tileMap";
import getNextTileData from "@client/utilities/TileMap/getNextTileData";
import aStar from "utilities/movement/aStar";

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

  const allowed = allowedToMove(currentRoundTile, newTarget, movement, tileMap);

  if (allowed) {
    movement.pathingTo = newTarget;

    try {
      const path = aStar.findPath(
        tileMap.fileName,
        currentRoundTile,
        newTarget,
        columns
      );

      if (path.length) {
        movement.tileQueue = path;
        movement.targetTile = newTarget;

        if (mapDir) {
          const isEdge = getNextTileData(newTarget, rows, columns, mapDir);

          if (isEdge) {
            entity.addComponent(ChangeMap, { direction: mapDir });
          }
        }
      }
      movement.pathingTo = undefined;
    } catch (_) {}
  }

  entity.removeComponent(NewMovementTarget);
};

const allowedToMove = (
  currentTile: number,
  targetTile: number,
  movement: Movement,
  tileMap: TileMap
) => {
  const newTargetNotSameAsCurrent = targetTile !== currentTile;
  const movementDirectionDisabled = !movement.direction;
  const targetNotInDirection =
    targetTile !==
    tileInDirection(
      movement.currentTile,
      movement.direction,
      tileMap.height,
      tileMap.width
    );
  const notAlreadyMovingInTheDirection =
    movement.pathingTo === undefined || movement.pathingTo !== targetTile;
  const tileQueueEmptyOrDestinationIsTheSameAsTarget =
    !movement.tileQueue.length ||
    movement.tileQueue[movement.tileQueue.length - 1] !== targetTile;

  if (
    newTargetNotSameAsCurrent &&
    (movementDirectionDisabled || targetNotInDirection) &&
    notAlreadyMovingInTheDirection &&
    tileQueueEmptyOrDestinationIsTheSameAsTarget &&
    isWalkable(tileMap, targetTile)
  ) {
    return true;
  }
  return false;
};
