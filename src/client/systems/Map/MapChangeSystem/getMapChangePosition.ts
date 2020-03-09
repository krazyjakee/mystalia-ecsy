import { ObjectTileStore } from "../../../utilities/TileMap/ObjectTileStore";
import Movement from "src/client/components/Movement";

export default (
  player: Movement,
  columns: number,
  rows: number,
  objectTileStore: ObjectTileStore
) => {
  const direction = player.direction || player.previousDirection;
  const currentTile = player.currentTile;
  const objectTile = objectTileStore.get(currentTile);

  if (objectTile) {
    switch (objectTile.type) {
      case "door": {
        if (objectTile.value) {
          return objectTile.value.tile;
        }
        break;
      }
    }
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
