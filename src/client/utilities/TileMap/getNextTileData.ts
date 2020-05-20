import { Direction } from "types/Grid";
import isSideTile from "./isSideTile";

export default (
  currentTile: number,
  mapRows: number,
  mapColumns: number,
  currentDirection?: Direction
) => {
  const totalTiles = mapColumns * mapRows;

  const edge = isSideTile(mapColumns, totalTiles, currentTile);

  let direction = currentDirection;

  switch (direction) {
    case "e": {
      return edge.includes(direction);
    }
    case "w": {
      return edge.includes(direction);
    }
    case "n": {
      return edge.includes(direction);
    }
    case "s": {
      return edge.includes(direction);
    }
    default: {
      return false;
    }
  }
};
