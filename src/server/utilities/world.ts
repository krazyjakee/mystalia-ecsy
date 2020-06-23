import {
  pixelsToTileId,
  tileIdToPixels,
  tileIdToVector,
  vectorToTileId,
} from "../../utilities/tileMap";
import { getWorldMapItems, readMapFiles } from "@server/utilities/mapFiles";
import { isPresent } from "utilities/guards";
import { Vector } from "types/TMJ";
import { areColliding } from "utilities/math";
import WorldBlockList from "./world/WorldBlockList";
import * as AdmZip from "adm-zip";
import * as fs from "fs";
import {
  getWorldColumns,
  getWorldSize,
  getWorldFirstTile,
} from "./world/worldSize";
import { splitArrayByChunk } from "utilities/loops";

export const getMapColumns = (fileName: string) => {
  const maps = readMapFiles();
  return maps[fileName].width;
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

  return pixelsToTileId({ x, y }, getWorldColumns());
};

export const worldPixelsToTileId = (
  { x, y }: Vector,
  columns = getWorldColumns()
) => {
  const column = Math.floor(x / 32);
  const row = Math.floor(y / 32);
  return row * columns + column;
};

export const worldTileIdToPixels = (
  number: number,
  wSize = getWorldSize()
): Vector => {
  const zeroColumn = Math.abs(wSize.x / 32);
  const unmovedVector = tileIdToPixels(number + zeroColumn, wSize.width / 32);

  return {
    x: unmovedVector.x + wSize.x,
    y: unmovedVector.y,
  };
};

export type LocalTile = {
  tileId: number;
  fileName: string;
};

export const getLocalTileId = (tileId: number): LocalTile | undefined => {
  const worldMap = getWorldMapItems();

  const vector = worldTileIdToPixels(tileId);

  for (let i = 0; i < worldMap.length; i += 1) {
    const worldPosition = worldMap[i];

    const colliding = areColliding(worldPosition, {
      ...vector,
      width: 32,
      height: 32,
    });

    if (colliding) {
      const relativeVector = {
        x: 0 - (worldPosition.x - vector.x),
        y: 0 - (worldPosition.y - vector.y),
      };

      return {
        tileId: pixelsToTileId(relativeVector, worldPosition.width / 32),
        fileName: worldPosition.fileName,
      };
    }
  }
};

export const getRandomValidTile = async () => await wbl.randomValidTile();

export const isValidWorldTile = async (tileId: number) => {
  const isBlocked = await wbl.tileBlocked(tileId);
  const isOnAMap = getLocalTileId(tileId);
  return Boolean(!isBlocked && isOnAMap);
};

export const pathToRandomTile = async (
  startPosition: number,
  forceDestination?: number
) => {
  if (!wbl.aStar || !isValidWorldTile(startPosition)) return [];
  const worldFirstTile = getWorldFirstTile();
  const worldColumns = getWorldColumns();
  const randomTile = forceDestination || (await getRandomValidTile());
  const offsetStartTile = startPosition - worldFirstTile;
  const offsetDestinationTile = randomTile - worldFirstTile;

  const path = wbl.aStar.findPath(
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

const wbl = new WorldBlockList();

export const setupWorldBlockLists = async () => {
  const blockListPath = "./src/utilities/data/blockList.zip";
  if (fs.existsSync(blockListPath)) {
    await wbl.connection();
    const zip = new AdmZip(blockListPath);
    const hash = zip.getZipComment();
    const sameHash = await wbl.sameHash(hash);
    if (!sameHash) {
      await wbl.clearAll();
      const ProgressBar = require("progress");
      const zipEntries = zip.getEntries();
      for (let entryKey in zipEntries) {
        const zipEntry = zipEntries[entryKey];
        if (zipEntry.entryName === "allowList.json") {
          console.log("Updating world allow list...");
          const allowList = zipEntry
            .getData()
            .toString()
            .split(",");
          const chunked = splitArrayByChunk(allowList, 10000);
          const bar = new ProgressBar(":bar :current/:total", {
            total: chunked.length,
          });
          for (let listKey in chunked) {
            await wbl.addAllowList(chunked[listKey]);
            bar.tick();
          }
          await wbl.setAStarMatrix(allowList);
        }
        if (zipEntry.entryName === "blockList.json") {
          console.log("Updating world block list...");
          const blockList = zipEntry
            .getData()
            .toString()
            .split(",");
          const chunked = splitArrayByChunk(blockList, 10000);
          const bar = new ProgressBar(":bar :current/:total", {
            total: chunked.length,
          });
          for (let listKey in chunked) {
            await wbl.addBlockList(chunked[listKey]);
            bar.tick();
          }
        }
      }
      console.log("World block lists updated.");
      await wbl.setHash(hash);
    }
    console.log("Preparing world aStar for launch...");
    await wbl.setupWorldAStar();
    console.log("World aStar preparations complete.");
  }
};
