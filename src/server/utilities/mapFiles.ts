import * as fs from "fs";
import { getMapProperties } from "./tmjTools";
import { TMJ } from "types/TMJ";
import { readJSONFile } from "./files";

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
      const json = readJSONFile(`./assets/maps/${file.name}`);
      const properties = getMapProperties(json);
      maps[properties.name] = json;
    }
  }

  dir.closeSync();

  mapCache = maps;

  return maps;
};
