import { worldTileIdToPixels } from "@server/utilities/world";
import { areColliding } from "utilities/math";
import { getWorldMapItems } from "@server/utilities/mapFiles";
import { getWorldSize } from "@server/utilities/world/worldSize";

const worldMap = getWorldMapItems();

export const createBlockListFromOutOfBounds = (tileId) => {
  for (let mapKey in worldMap) {
    const pixels = worldTileIdToPixels(tileId, getWorldSize());

    if (areColliding(worldMap[mapKey], { ...pixels, width: 32, height: 32 })) {
      return true;
    }
  }
};
