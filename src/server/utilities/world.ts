import { pixelsToTileId, tileIdToPixels } from "../../utilities/tileMap";
import { getWorldMapItems, readMapFiles } from "@server/utilities/mapFiles";
import { Size } from "types/TileMap/standard";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { isPresent, clone } from "utilities/guards";
import { Vector } from "types/TMJ";
import { AStarFinder } from "astar-typescript";
import { getBlockGrid } from "utilities/movement/aStar";

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
    width: worldWidth / 32,
    height: worldHeight / 32,
    x: minXPosition,
    y: minYPosition,
  };
};

export const getWorldTileId = (
  fileName: string,
  tileId: number,
  mapColumns: number
) => {
  const vector = tileIdToPixels(tileId, mapColumns);
  const worldMap = getWorldMapItems();

  const worldMapPosition = worldMap.find(
    (mapItem) => mapItem.fileName.replace(".json", "") === fileName
  );
  if (!worldMapPosition) return;
  const x = worldMapPosition.x + vector.x;
  const y = worldMapPosition.y + vector.y;

  return pixelsToTileId({ x, y }, mapColumns);
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
          getWorldTileId(
            rawBlockList.fileName,
            blockedTile,
            rawBlockList.mapColumns
          )
        )
        .filter(isPresent)
    )
    .flat();
};

const worldSize = getWorldSize();
const worldBlockList = generateWorldBlockList();
export const worldAStar = new AStarFinder({
  grid: {
    matrix: getBlockGrid(
      worldBlockList,
      worldSize.width,
      worldSize.height,
      worldSize.x * worldSize.y
    ),
  },
  diagonalAllowed: false,
  includeStartNode: false,
});
