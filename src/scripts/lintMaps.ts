import * as fs from "fs";
import { readJSONFile } from "@server/utilities/files";
import { TMJ } from "types/TMJ";

const writeToFile = (json: TMJ, filename: string) => {
  fs.writeFileSync(
    `./assets/maps/${filename}`,
    JSON.stringify(json, null, " ")
  );
};

const roundTo32 = (input) => Math.round(input / 32) * 32;

const alignObjectsToGrid = (json: TMJ, fileName: string) => {
  // json.layers = json.layers.map((layer) => {
  //   if (layer.type === "objectgroup") return layer;
  //   if (!layer.objects) return layer;

  //   layer.objects = layer.objects.map((tile) => {
  //     if (!tile.polygon) return tile;
  //     return {
  //       ...tile,
  //       x: roundTo32(tile.x),
  //       y: roundTo32(tile.y),
  //       width: roundTo32(tile.width),
  //       height: roundTo32(tile.height),
  //     };
  //   });

  //   return layer;
  // });

  writeToFile(json, fileName);
};

const dir = fs.opendirSync("./assets/maps");
let file;
while ((file = dir.readSync()) !== null) {
  if (file.name.includes(".json")) {
    const json = readJSONFile(`./assets/maps/${file.name}`) as TMJ;
    alignObjectsToGrid(json, file.name);
  }
}

dir.closeSync();
