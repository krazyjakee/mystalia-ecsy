import { Entity } from "ecsy";
import Movement from "../../components/Movement";
import Position from "../../components/Position";
import NewMovementTarget from "../../components/NewMovementTarget";
import isWalkable from "../../utilities/TileMap/isWalkable";
import tileInDirection from "../../utilities/TileMap/tileInDirection";
import roundVector from "../../utilities/Vector/roundVector";
import TileMap from "../../components/TileMap";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";

export default (entity: Entity, tileMap: TileMap) => {
  const columns = tileMap.width;
  const rows = tileMap.height;
  const movement = entity.getMutableComponent(Movement);
  const position = entity.getMutableComponent(Position);
  const newTarget = entity.getComponent(NewMovementTarget).targetTile;

  const roundPosition = roundVector(position.value);
  const currentRoundTile = vectorToTileId(roundPosition, columns);

  const destinationTile = tileIdToVector(newTarget, columns);
  if (
    // don't set a new destination if we're already there or going there
    newTarget !== currentRoundTile &&
    (!movement.direction ||
      newTarget !==
        tileInDirection(
          movement.currentTile,
          movement.direction,
          rows,
          columns
        )) &&
    (movement.pathingTo === undefined || movement.pathingTo !== newTarget) &&
    (!movement.tileQueue.length ||
      movement.tileQueue[movement.tileQueue.length - 1] !== newTarget) &&
    isWalkable(tileMap, newTarget)
  ) {
    movement.pathingTo = newTarget;
    try {
      const path = tileMap.objectTileStore.aStar.findPath(
        roundPosition,
        destinationTile
      );
      if (path) {
        movement.tileQueue = path.map(p => p[0] + p[1] * columns);
        movement.targetTile = newTarget;
      }
      movement.pathingTo = undefined;
    } catch (_) {}
  }

  entity.removeComponent(NewMovementTarget);
};
