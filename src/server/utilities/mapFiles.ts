import * as fs from "fs";
import { getMapProperties } from "./tmjTools";
import { TMJ } from "types/TMJ";
import { readJSONFile } from "./files";

type MapDataCache = { [key: string]: TMJ };
let mapCache: MapDataCache;

export type WorldMapData = {
  fileName: string;
  x: number;
  y: number;
};

export type WorldMapDataFile = {
  maps: WorldMapData[];
  type: string;
};

export type WorldMapItem = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const readMapFiles = () => {
  if (mapCache) {
    return mapCache;
  }

  const dir = fs.opendirSync("./assets/maps");
  let maps: MapDataCache = {};

  let file;
  while ((file = dir.readSync()) !== null) {
    if (file.name.includes(".json")) {
      const json = readJSONFile(`./assets/maps/${file.name}`);
      const properties = getMapProperties(json);
      maps[properties.name] = json;
    }
  }

  dir.closeSync();

  mapCache = maps;

  return maps;
};

const worldMapItems: WorldMapItem[] = [];

export const getWorldMapItems = () => {
  if (worldMapItems.length) return worldMapItems;

  const worldData = readJSONFile(
    "./assets/maps/maps.world"
  ) as WorldMapDataFile;
  const mapData = readMapFiles();

  worldData.maps.forEach((worldMapData) => {
    const { fileName, x, y } = worldMapData;
    const name = fileName.split(".")[0];
    const map = mapData[name];
    worldMapItems.push({
      name,
      x,
      y,
      width: map.width * 32,
      height: map.height * 32,
    });
  });

  return worldMapItems;
};
