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
      return {
        isEdge: edge.includes(direction),
        compass: "east",
      };
    }
    case "w": {
      return {
        isEdge: edge.includes(direction),
        compass: "west",
      };
    }
    case "n": {
      return {
        isEdge: edge.includes(direction),
        compass: "north",
      };
    }
    case "s": {
      return {
        isEdge: edge.includes(direction),
        compass: "south",
      };
    }
    default: {
      return {
        isEdge: false,
        compass: "south",
      };
    }
  }
};
