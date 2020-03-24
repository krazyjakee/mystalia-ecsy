import { ObjectTileStore } from "../../../utilities/TileMap/ObjectTileStore";
import Movement from "src/client/components/Movement";
import { DoorTileType } from "types/TileMap/ObjectTileStore";

export default (
  player: Movement,
  columns: number,
  rows: number,
  objectTileStore: ObjectTileStore
) => {
  const direction = player.direction || player.previousDirection;
  const currentTile = player.currentTile;
  const objectTile = objectTileStore.get(currentTile);

  if (objectTile && objectTile.value) {
    switch (objectTile.type) {
      case "door": {
        return (objectTile.value as DoorTileType).tile;
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
