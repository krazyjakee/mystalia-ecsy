import { readMapFiles, getWorldMapItems } from "@server/utilities/mapFiles";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { getWorldTileId } from "@server/utilities/world";
import { isPresent } from "utilities/guards";

const worldMap = getWorldMapItems();

export const generateWorldBlockList = () => {
  const maps = readMapFiles();
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
