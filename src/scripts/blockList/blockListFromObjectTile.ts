import { readMapFiles, getWorldMapItems } from "@server/utilities/mapFiles";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { getWorldTileId } from "@server/utilities/world";
import { isPresent } from "utilities/guards";

const worldMap = getWorldMapItems();
const maps = readMapFiles();

export const generateWorldBlockList = () => {
  const mapKeys = Object.keys(maps).filter((key) =>
    worldMap.find((map) => map.fileName === key)
  );

  const rawBlockLists = mapKeys.map((key) => {
    const ots = new ObjectTileStore(maps[key]);
    return {
      blockList: ots.blockList,
      allowList: ots.allowList,
      fileName: key,
      mapColumns: maps[key].width,
    };
  });

  const blockLists = rawBlockLists
    .map((rawBlockList) =>
      rawBlockList.blockList
        .map((blockedTile) =>
          getWorldTileId(rawBlockList.fileName, blockedTile)
        )
        .filter(isPresent)
    )
    .flat();

  const allowLists = rawBlockLists
    .map((rawBlockList) =>
      rawBlockList.allowList
        .map((allowedTile) =>
          getWorldTileId(rawBlockList.fileName, allowedTile)
        )
        .filter(isPresent)
    )
    .flat();

  return {
    blockLists,
    allowLists,
  };
};
