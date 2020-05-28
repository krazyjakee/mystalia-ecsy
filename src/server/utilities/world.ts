import { pixelsToTileId, tileIdToPixels } from "../../utilities/tileMap";
import { getWorldMapItems, readMapFiles } from "@server/utilities/mapFiles";
import { Size } from "types/TileMap/standard";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { isPresent, clone } from "utilities/guards";
import { Vector } from "types/TMJ";
import { AStarFinder } from "astar-typescript";
import { getBlockGrid } from "utilities/movement/aStar";
import { areColliding } from "utilities/math";

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
  const worldSize = getWorldSize();

  const worldMapPosition =
    worldMap.find(
      (mapItem) => mapItem.fileName.replace(".json", "") === fileName
    ) || worldMap[0];

  const mapColumns = worldMapPosition.width / 32;
  const vector = tileIdToPixels(tileId, mapColumns);
  const x = worldMapPosition.x + vector.x;
  const y = worldMapPosition.y + vector.y;

  return pixelsToTileId({ x, y }, worldSize.width / 32);
};

export const getLocalTile = (tileId: number) => {
  const worldMap = getWorldMapItems();
  const worldSize = getWorldSize();

  const vector = tileIdToPixels(tileId, worldSize.width / 32);

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

export const generateWorldBlockList = () => {
  const maps = readMapFiles();
  const worldMap = getWorldMapItems();
  const mapKeys = Object.keys(maps).filter((key) =>
    worldMap.find((map) => map.fileName === key)
  );

  const rawBlockLists = mapKeys.map((key) => ({
    blockList: new ObjectTileStore(maps[key]).blockList,
    fileName: key,
    mapColumns: maps[key].width,
  }));

  return rawBlockLists
    .map((rawBlockList) =>
      rawBlockList.blockList
        .map((blockedTile) =>
          getWorldTileId(rawBlockList.fileName, blockedTile)
        )
        .filter(isPresent)
    )
    .flat();
};

export const worldSize = getWorldSize();
export const worldBlockList = generateWorldBlockList();
export const worldAStar = new AStarFinder({
  grid: {
    matrix: getBlockGrid(
      worldBlockList,
      worldSize.width / 32,
      worldSize.height / 32,
      worldSize.x * worldSize.y
    ),
  },
  diagonalAllowed: false,
  includeStartNode: false,
});
