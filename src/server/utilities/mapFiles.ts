import * as fs from "fs";
import { getMapProperties } from "./tmjTools";
import { TMJ } from "types/TMJ";

type MapDataCache = { [key: string]: TMJ };
let mapCache: MapDataCache;

export const readMapFiles = () => {
  if (mapCache) {
    return mapCache;
  }

  const dir = fs.opendirSync("./assets/maps");
  let maps: MapDataCache = {};

  let file;
  while ((file = dir.readSync()) !== null) {
    if (file.name.includes(".json")) {
      const rawBuffer = fs
        .readFileSync(`./assets/maps/${file.name}`)
        .toString();
      const json = JSON.parse(rawBuffer);
      const properties = getMapProperties(json);
      maps[properties.name] = json;
    }
  }

  dir.closeSync();

  mapCache = maps;

  return maps;
};
