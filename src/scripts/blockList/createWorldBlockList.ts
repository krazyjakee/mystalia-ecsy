import { worldSize, worldFirstTile } from "@server/utilities/world";
import { writeFile } from "@server/utilities/files";
import { generateWorldBlockList } from "./blockListFromObjectTile";
import { createBlockListFromOutOfBounds } from "./blockListFromOutOfBounds";
import * as fs from "fs";

writeFile("./src/utilities/data/blockList.tmp.json", "[]");
const cluster = require("cluster");

type WorkerMessage = { type: number; tiles: number[] };

const totalTiles = (worldSize.width * worldSize.height) / 32;

if (cluster.isWorker) {
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

  let allowedTiles: number[] = [];
  const writeStream = fs.createWriteStream(
    "./src/utilities/data/blockList.tmp.json"
  );
  writeStream.write("[" + generateWorldBlockList().toString());

  workers.forEach((worker) => {
    worker.on("message", function(msg: WorkerMessage) {
      if (msg.type === 0) {
        writeStream.write(msg.tiles.toString());
      } else if (msg.type === 1) {
        allowedTiles = allowedTiles.concat(msg.tiles);
      }

      counter += 1;

      if (counter === cpuCount) {
        writeStream.write("]");
        writeStream.close();
        // writeFile(
        //   "./src/utilities/data/allowList.json",
        //   JSON.stringify(allowedTiles)
        // );
        console.log("Done.");
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
