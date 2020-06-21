import { worldColumns, worldTileIdToPixels } from "@server/utilities/world";
import { tileIdToPixels } from "utilities/tileMap";
import { areColliding } from "utilities/math";
import { getWorldMapItems } from "@server/utilities/mapFiles";

const worldMap = getWorldMapItems();

export const createBlockListFromOutOfBounds = (tileId) => {
  for (let mapKey in worldMap) {
    const pixels = worldTileIdToPixels(tileId, worldColumns);

    if (areColliding(worldMap[mapKey], { ...pixels, width: 32, height: 32 })) {
      return true;
    }
  }
};
