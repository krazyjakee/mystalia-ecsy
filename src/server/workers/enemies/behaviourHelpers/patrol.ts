import { ObjectTileStore } from "utilities/ObjectTileStore";
import { randomItemFromArray } from "utilities/math";

export const selectRandomPatrolTile = (ots: ObjectTileStore, id: number) => {
  const allPatrolTiles = ots.getAllByType("patrol");
  const patrolTiles = allPatrolTiles
    .filter((patrolTile) => patrolTile.objectTile.value.id === id)
    .map((patrolTile) => patrolTile.tileId);
  return randomItemFromArray(patrolTiles);
};
