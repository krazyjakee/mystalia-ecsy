import { writeFile } from "@server/utilities/files";
import * as fs from "fs";
import { randomHash } from "utilities/hash";
import {
  getWorldSize,
  getWorldFirstTile,
} from "@server/utilities/world/worldSize";

const cluster = require("cluster");

type WorkerMessage = { type: number; tiles: number[] };

if (cluster.isWorker) {
  const {
    createBlockListFromOutOfBounds,
  } = require("./blockListFromOutOfBounds");
  process.on("message", function(msg: WorkerMessage) {
    if (msg.type === 0) {
      const tiles: number[] = msg.tiles.filter((tileId) => {
        return !createBlockListFromOutOfBounds(tileId);
      });
      // @ts-ignore
      process.send({ type: msg.type, tiles });
    }
  });
}

if (cluster.isMaster) {
  const blockListFilePath = "./src/utilities/data/blockList.json";
  const allowListFilePath = "./src/utilities/data/allowList.json";
  const blockListZipPath = "./src/utilities/data/blockList.zip";

  const worldSize = getWorldSize();
  const worldFirstTile = getWorldFirstTile();
  const { generateWorldBlockList } = require("./blockListFromObjectTile");
  const totalTiles = (worldSize.width * worldSize.height) / 32;

  const os = require("os");
  const cpuCount = os.cpus().length;
  const workers = new Array(cpuCount).fill(0).map(() => cluster.fork());

  let workerIndex = 0;
  const nextWorker = () => {
    if (workerIndex < cpuCount - 1) {
      workerIndex += 1;
      return workers[workerIndex];
    } else {
      workerIndex = 0;
      return workers[workerIndex];
    }
  };

  let counter = 0;
  const allTiles: number[] = [];
  for (let i = worldFirstTile, j = 0; j < totalTiles; i += 1, j += 1) {
    allTiles.push(i);
  }

  const writeStream = fs.createWriteStream(blockListFilePath);
  const mapTileLists = generateWorldBlockList();
  writeFile(allowListFilePath, mapTileLists.allowLists.toString());
  writeStream.write(mapTileLists.blockLists.toString() + ",");

  workers.forEach((worker) => {
    worker.on("message", function(msg: WorkerMessage) {
      if (msg.type === 0) {
        writeStream.write(msg.tiles.toString());
      }

      counter += 1;

      if (counter === cpuCount) {
        writeStream.close();
        console.log("Block list generation complete. Packaging it up...");
        if (fs.existsSync(blockListZipPath)) {
          fs.unlinkSync(blockListZipPath);
        }

        const AdmZip = require("adm-zip");
        const zip = new AdmZip();
        zip.addZipComment(randomHash());
        zip.addLocalFile(blockListFilePath);
        zip.addLocalFile(allowListFilePath);
        zip.writeZip(blockListZipPath);
        fs.unlinkSync(blockListFilePath);
        fs.unlinkSync(allowListFilePath);

        console.log("Done.");
        process.exit(0);
      } else {
        writeStream.write(",");
      }
    });
  });

  console.log(`${workers.length} threads started...`);

  const sliceSize = Math.ceil(totalTiles / cpuCount);
  const slices = new Array(cpuCount)
    .fill(0)
    .map((_, index) =>
      allTiles.slice(index * sliceSize, index * sliceSize + sliceSize)
    );
  slices.forEach((tiles) => {
    nextWorker().send({ type: 0, tiles });
  });
}
