import * as fs from "fs";
import { readJSONFile } from "@server/utilities/files";
import { getMapProperties } from "@server/utilities/tmjTools";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { TMJ } from "types/TMJ";

const errors: string[] = [];
const roomFileNames: string[] = [];
const objectTileStores: { [key: string]: ObjectTileStore } = {};
const mapJsons: { [key: string]: TMJ } = {};

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
    if (properties.biome === "") {
      errors.push(`"${filename}" has a biome property but it is empty.`);
    }
    roomFileNames.push(filename);
    objectTileStores[filename] = new ObjectTileStore(json);
    mapJsons[filename] = json;
  }
}

dir.closeSync();

// Check doors are correctly configured
Object.keys(objectTileStores).forEach((key) => {
  const ots = objectTileStores[key];
  ots.getAllByType("door").forEach((doorTiles) => {
    const door = doorTiles.objectTile;
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

for (let key in mapJsons) {
  const tmj = mapJsons[key];

  // Check object types are correct
  tmj.layers.forEach((layer) => {
    if (layer.objects) {
      layer.objects.forEach((tile) => {
        if (tile.type === "flame" && !tile.polygon) {
          errors.push(
            `Flame on map "${key}" is not a polygon. Always use the polygon tool when making flame objects.`
          );
        }
      });
    }
  });

  // Check tilesets exist
  tmj.tilesets
    .map((tileset) => tileset.source)
    .forEach((tileSetPath) => {
      const path = tileSetPath.replace(/\\/g, "").replace("..", "./assets");
      if (!fs.existsSync(path)) {
        errors.push(
          `Tileset on map "${key}" does not exists at ${tileSetPath}`
        );
      }
    });
}

errors.forEach((error) => {
  console.error(error);
});

if (errors.length) {
  console.error(`Found ${errors.length} map errors.`);
  process.exit(1);
} else {
  console.log("All map tests passed!");
  process.exit(0);
}
