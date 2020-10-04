import * as fs from "fs";
import { readMapFiles, readTileSets } from "@server/utilities/mapFiles";
import { TMJ } from "types/TMJ";
import { isPresent } from "utilities/guards";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { objectForEach } from "utilities/loops";
import { pixelsToTileId } from "utilities/tileMap";

const writeToFile = (json: TMJ, filename: string) => {
  fs.writeFileSync(`./assets/maps/${filename}`, JSON.stringify(json));
};

const tileSetStore = readTileSets();
const mapFiles = readMapFiles();

const roundTo32 = (input) => Math.round(input / 32) * 32;

const alignObjectsToGrid = (json: TMJ) => {
  json.layers = json.layers.map((layer) => {
    if (layer.type !== "objectgroup") return layer;
    if (!layer.objects) return layer;

    layer.objects = layer.objects.map((tile) => {
      if (tile.polygon) return tile;
      return {
        ...tile,
        x: roundTo32(tile.x),
        y: roundTo32(tile.y),
        width: roundTo32(tile.width),
        height: roundTo32(tile.height),
      };
    });

    return layer;
  });

  return json;
};

const removeUnnecessaryBlockObjects = (json: TMJ) => {
  const objectTileStore = new ObjectTileStore(json, tileSetStore);
  const blockDupeTileIds: number[] = [];
  objectForEach(objectTileStore.store, (tileId, tileObjects) => {
    const blockObjects = tileObjects?.filter(
      (tileObject) => tileObject.type === "block"
    );
    if (blockObjects && blockObjects.length > 1) {
      blockDupeTileIds.push(parseInt(tileId));
    }
  });

  json.layers = json.layers.map((layer) => {
    if (layer.type !== "objectgroup") return layer;
    if (!layer.objects) return layer;

    layer.objects = layer.objects.filter((tile) => {
      if (
        (tile.type === "" || tile.type === "block") &&
        blockDupeTileIds.includes(pixelsToTileId(tile, json.width))
      ) {
        return false;
      }
      return true;
    });

    return layer;
  });

  return json;
};

const fixProperties = (json: TMJ) => {
  json.properties = json.properties
    .map((property) => {
      if (property.name === "biome") {
        if (!property.value) {
          return null;
        }
      }
      return property;
    })
    .filter(isPresent);

  return json;
};

Object.keys(mapFiles).forEach((key) => {
  let json = mapFiles[key] as TMJ;
  // json = alignObjectsToGrid(json);
  // json = fixProperties(json);
  json = removeUnnecessaryBlockObjects(json);
  writeToFile(json, `${key}.json`);
});
