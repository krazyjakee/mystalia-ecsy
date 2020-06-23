import memoize from "utilities/memoize";
import { Size } from "types/TileMap/standard";
import { Vector } from "types/TMJ";
import { getWorldMapItems } from "../mapFiles";
import { clone } from "utilities/guards";
import { pixelsToTileId } from "utilities/tileMap";

let worldSize: Size & Vector;

export const getWorldSize = (): Size & Vector => {
  if (worldSize) return worldSize;

  const worldMap = getWorldMapItems();

  const farthest = clone(worldMap);
  farthest.sort((a, b) => b.x + b.width - (a.x + a.width));
  const farthestEast = farthest[0].x + farthest[0].width;
  farthest.sort((a, b) => b.y + b.height - (a.y + a.height));
  const farthestSouth = farthest[0].y + farthest[0].height;

  const xPositions = worldMap.map((map) => map.x);
  const yPositions = worldMap.map((map) => map.y);
  const minXPosition = Math.min(...xPositions);
  const minYPosition = Math.min(...yPositions);
  const worldWidth = farthestEast - minXPosition;
  const worldHeight = farthestSouth - minYPosition;

  worldSize = {
    width: worldWidth,
    height: worldHeight,
    x: minXPosition,
    y: minYPosition,
  };

  return worldSize;
};

export const getWorldColumns = () => getWorldSize().width / 32;
export const getWorldFirstTile = () =>
  pixelsToTileId(getWorldSize(), getWorldColumns());
