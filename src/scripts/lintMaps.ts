import * as fs from "fs";
import { readJSONFile } from "@server/utilities/files";
import { TMJ } from "types/TMJ";
import { isPresent } from "utilities/guards";

const writeToFile = (json: TMJ, filename: string) => {
  fs.writeFileSync(`./assets/maps/${filename}`, JSON.stringify(json));
};

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

const dir = fs.opendirSync("./assets/maps");
let file;
while ((file = dir.readSync()) !== null) {
  if (file.name.includes(".json")) {
    let json = readJSONFile(`./assets/maps/${file.name}`) as TMJ;
    json = alignObjectsToGrid(json);
    json = fixProperties(json);
    writeToFile(json, file.name);
  }
}

dir.closeSync();
