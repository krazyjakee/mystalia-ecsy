import {
  pixelsToTileId,
  tileIdToPixels,
  tileIdToVector,
  vectorToTileId,
} from "../../utilities/tileMap";
import { getWorldMapItems, readMapFiles } from "@server/utilities/mapFiles";
import { Size } from "types/TileMap/standard";
import { isPresent, clone } from "utilities/guards";
import { Vector } from "types/TMJ";
import { AStarFinder } from "astar-typescript";
import { getBlockGrid } from "utilities/movement/aStar";
import { areColliding, randomItemFromArray } from "utilities/math";

export const getMapColumns = (fileName: string) => {
  const maps = readMapFiles();
  return maps[fileName].width;
};

export const getWorldSize = (): Size & Vector => {
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

  return {
    width: worldWidth,
    height: worldHeight,
    x: minXPosition,
    y: minYPosition,
  };
};

export const getWorldTileId = (fileName: string, tileId: number) => {
  const worldMap = getWorldMapItems();
  const worldMapPosition =
    worldMap.find(
      (mapItem) => mapItem.fileName.replace(".json", "") === fileName
    ) || worldMap[0];

  const mapColumns = worldMapPosition.width / 32;
  const vector = tileIdToPixels(tileId, mapColumns);
  const x = worldMapPosition.x + vector.x;
  const y = worldMapPosition.y + vector.y;

  return pixelsToTileId({ x, y }, worldColumns);
};

export type LocalTile = {
  tileId: number;
  fileName: string;
};

export const getLocalTileId = (tileId: number): LocalTile | undefined => {
  const worldMap = getWorldMapItems();
  const worldSize = getWorldSize();

  const vector = tileIdToPixels(tileId, worldColumns);

  for (let i = 0; i < worldMap.length; i += 1) {
    const worldPosition = worldMap[i];

    const adjustedVector = {
      x: tileId > 0 ? vector.x : vector.x + worldSize.width,
      y: vector.y,
    };
    const colliding = areColliding(worldPosition, {
      ...adjustedVector,
      width: 32,
      height: 32,
    });

    const relativeVector = {
      x: 0 - (worldPosition.x - adjustedVector.x),
      y: 0 - (worldPosition.y - adjustedVector.y),
    };

    if (colliding) {
      return {
        tileId: pixelsToTileId(relativeVector, worldPosition.width / 32),
        fileName: worldPosition.fileName,
      };
    }
  }
};

export const getRandomValidTile = () => randomItemFromArray(worldAllowList);

export const isValidWorldTile = (tileId: number) => {
  const isBlocked = worldBlockList.includes(tileId);
  const isOnAMap = getLocalTileId(tileId);
  return Boolean(!isBlocked && isOnAMap);
};

export const pathToRandomTile = (
  startPosition: number,
  forceDestination?: number
) => {
  if (!isValidWorldTile(startPosition)) return [];
  const randomTile = forceDestination || getRandomValidTile();
  const offsetStartTile = startPosition - worldFirstTile;
  const offsetDestinationTile = randomTile - worldFirstTile;

  const path = worldAStar.findPath(
    tileIdToVector(offsetStartTile, worldColumns),
    tileIdToVector(offsetDestinationTile, worldColumns)
  );

  if (path.length) {
    return path
      .map(
        (pathItem) =>
          vectorToTileId({ x: pathItem[0], y: pathItem[1] }, worldColumns) +
          worldFirstTile
      )
      .map((worldTileId) => getLocalTileId(worldTileId))
      .filter(isPresent);
  }
};

export const getNextPathChunk = (
  fileName: string,
  worldTilePath: LocalTile[]
) => {
  let chunkBegan = -1;
  for (let i = 0; i < worldTilePath.length; i += 1) {
    const tile = worldTilePath[i];
    if (tile.fileName === fileName) {
      if (chunkBegan === -1) chunkBegan = i;
    } else if (chunkBegan > -1) {
      return {
        start: chunkBegan,
        end: i - 1,
      };
    }
  }
};

export const worldSize = getWorldSize();
export const worldColumns = worldSize.width / 32;
export const worldFirstTile = pixelsToTileId(worldSize, worldColumns);
export const worldBlockList = require("utilities/data/blockList.json");
export const worldAllowList = require("utilities/data/allowList.json");
export const worldAStar = new AStarFinder({
  grid: {
    matrix: getBlockGrid(
      worldBlockList,
      worldSize.height / 32,
      worldColumns,
      worldFirstTile
    ),
  },
  diagonalAllowed: false,
  includeStartNode: false,
});
