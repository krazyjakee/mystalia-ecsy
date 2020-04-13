import { ObjectTileStore } from "utilities/ObjectTileStore";
import { Direction } from "types/Grid";

export default (
  direction: Direction | undefined,
  currentTile: number,
  columns: number,
  rows: number,
  objectTileStore: ObjectTileStore
) => {
  const objectTile = objectTileStore.getByType<"door">(currentTile, "door");

  if (objectTile && objectTile.value) {
    return objectTile.value.tile;
  }

  switch (direction) {
    case "n": {
      return currentTile + columns * (rows - 1);
    }
    case "s": {
      return currentTile - columns * (rows - 1);
    }
    case "e": {
      return currentTile - columns + 1;
    }
    case "w": {
      return currentTile + columns - 1;
    }
    default: {
      return 0;
    }
  }
};
