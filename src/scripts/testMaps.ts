import * as fs from "fs";
import { readJSONFile } from "@server/utilities/files";
import { getMapProperties } from "@server/utilities/tmjTools";
import { ObjectTileStore } from "utilities/ObjectTileStore";

const errors: string[] = [];
const roomFileNames: string[] = [];
const objectTileStores: { [key: string]: ObjectTileStore } = {};

const dir = fs.opendirSync("./assets/maps");

let file;
while ((file = dir.readSync()) !== null) {
  if (file.name.includes(".json")) {
    const json = readJSONFile(`./assets/maps/${file.name}`);
    const properties = getMapProperties(json);
    const filename = file.name.replace(".json", "");
    if (filename.includes(" ")) {
      errors.push(
        `"${filename}" has a space in the filename. Spaces in map filenames are not allowed.`
      );
    }
    if (!properties.name) {
      errors.push(
        `"${filename}" does not have a name map property. All maps must have a name.`
      );
    }
    roomFileNames.push(filename);
    objectTileStores[filename] = new ObjectTileStore(json);
  }
}

dir.closeSync();

Object.keys(objectTileStores).forEach((key) => {
  const ots = objectTileStores[key];
  console.log(ots.getAllByType("door").length);
  ots.getAllByType("door").forEach((door) => {
    if (!door.value) {
      errors.push(
        `door on map "${key}" has no values. Doors must have a map and tile value.`
      );
    } else if (!door.value.map) {
      errors.push(
        `door on map "${key}" has no map value. Doors must have a map and tile value.`
      );
    } else if (!door.value.tile) {
      errors.push(
        `door on map "${key}" has no tile value. Doors must have a map and tile value.`
      );
    } else if (!roomFileNames.includes(door.value.map)) {
      errors.push(
        `door on map "${key}" goes to an invalid map (${door.value.map})`
      );
    }
  });
});

errors.forEach((error) => {
  console.error(error);
});
