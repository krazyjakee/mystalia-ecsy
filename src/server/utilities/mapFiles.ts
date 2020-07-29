import { resolve } from "path";
import * as fs from "fs";
import { TMJ } from "types/TMJ";
import { readJSONFile } from "./files";
import memoize from "utilities/memoize";
import { TileSetStore } from "types/TileMap/TileSetStore";

type MapDataCache = { [key: string]: TMJ };

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
  fileName: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const readMapFiles = memoize(() => {
  let maps: MapDataCache = {};

  getFiles("./assets/maps")
    .filter((file) => file.includes(".json"))
    .forEach((file) => {
      const json = readJSONFile(file);
      const filename = file.split("/").pop().replace(".json", "");
      maps[filename] = json;
      maps[filename].properties.push({
        name: "fileName",
        type: "string",
        value: filename,
      });
    });

  return maps;
});

export const readTileSets = memoize(
  (): TileSetStore => {
    let tileSetStore: TileSetStore = {};

    getFiles("./assets/tilesets")
      .filter((file) => file.includes(".json"))
      .forEach((file) => {
        const json = readJSONFile(file);
        const storeKey = file.replace(/(.*)\/assets\/tilesets/, "../tilesets");
        tileSetStore[storeKey] = json;
      });

    return tileSetStore;
  }
);

const worldMapItems: WorldMapItem[] = [];

export const getWorldMapItems = memoize(() => {
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
      fileName: name,
      x,
      y,
      width: map.width * 32,
      height: map.height * 32,
    });
  });

  return worldMapItems;
});

function getFiles(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
}
