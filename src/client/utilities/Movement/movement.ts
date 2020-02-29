import Movement from "src/client/components/Movement";
import { Direction } from "types/Grid";
import { tileIdToVector } from "../TileMap/calculations";

export const getNextTileData = (
  player: Movement,
  mapRows: number,
  mapColumns: number,
  currentDirection?: Direction
) => {
  const totalTiles = mapColumns * mapRows;

  const edge = isSideTile(mapColumns, totalTiles, player.currentTile);

  let direction = currentDirection;

  switch (direction) {
    case "e": {
      return {
        isEdge: edge.includes(direction),
        compass: "east"
      };
    }
    case "w": {
      return {
        isEdge: edge.includes(direction),
        compass: "west"
      };
    }
    case "n": {
      return {
        isEdge: edge.includes(direction),
        compass: "north"
      };
    }
    case "s": {
      return {
        isEdge: edge.includes(direction),
        compass: "south"
      };
    }
    default: {
      return {
        isEdge: false,
        compass: "south"
      };
    }
  }
};

export const isSideTile = (
  columns: number,
  totalTiles: number,
  currentTile: number
): Direction[] => {
  const tileId = currentTile + 1;
  const resultArray: Direction[] = [];
  if (tileId <= columns) {
    resultArray.push("n");
  }
  if (tileId > totalTiles - columns) {
    resultArray.push("s");
  }
  if (tileId % columns === 0) {
    resultArray.push("e");
  }
  if ((tileId - 1) % columns === 0) {
    resultArray.push("w");
  }

  return resultArray;
};

export const directionFromTile = (
  from: number,
  to: number,
  columns: number
): Direction => {
  const fromVector = tileIdToVector(from, columns);
  const toVector = tileIdToVector(to, columns);
  if (fromVector.y === toVector.y) {
    return fromVector.x > toVector.x ? "w" : "e";
  }
  return fromVector.y > toVector.y ? "n" : "s";
};

export const compassDirections: Array<Direction> = ["n", "e", "s", "w"];
