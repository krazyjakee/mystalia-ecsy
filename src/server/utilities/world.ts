import { tileIdToVector, vectorToTileId } from "../../utilities/tileMap";
import { getWorldMapItems, readMapFiles } from "@server/utilities/mapFiles";
import { Size } from "types/TileMap/standard";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { isPresent } from "utilities/guards";

// TODO: Test this
export const getWorldSize = (): Size => {
  const worldMap = getWorldMapItems();
  const xPositions = worldMap.map((map) => map.x);
  const yPositions = worldMap.map((map) => map.y);
  const worldWidth = Math.max(...xPositions) - Math.min(...xPositions);
  const worldHeight = Math.max(...yPositions) - Math.min(...yPositions);
  return {
    width: worldWidth,
    height: worldHeight,
  };
};

// TODO: Test this
export const getWorldTileId = (
  fileName: string,
  tileId: number,
  mapColumns: number
) => {
  const vector = tileIdToVector(tileId, mapColumns);
  const worldMap = getWorldMapItems();

  const worldMapPosition = worldMap.find(
    (mapItem) => mapItem.fileName.replace(".json", "") === fileName
  );
  if (!worldMapPosition) return;
  const x = worldMapPosition.x + vector.x;
  const y = worldMapPosition.y + vector.y;

  return vectorToTileId({ x, y }, mapColumns);
};

// TODO: Test this
export const generateWorldBlockGrid = () => {
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
