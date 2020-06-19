import {
  worldSize,
  worldColumns,
  worldFirstTile,
} from "@server/utilities/world";
import { createReadStream } from "fs";
import { tileIdToPixels } from "utilities/tileMap";

const ProgressBar = require("progress");
const JSONStream = require("JSONStream");
const es = require("event-stream");

const draw = () => {
  const PImage = require("pureimage");
  const img1 = PImage.make(worldSize.width / 16, worldSize.height / 16);
  const bar = new ProgressBar(":bar :current/:total :percent :eta", {
    total: (worldSize.width * worldSize.height) / 32,
  });
  var ctx = img1.getContext("2d");
  ctx.fillStyle = "rgba(255,0,0, 0.5)";
  const readStream = createReadStream(
    "./src/utilities/data/blockList.tmp.json"
  );
  readStream.pipe(JSONStream.parse("*")).pipe(
    es.mapSync(function(data) {
      const pixels = tileIdToPixels(data - worldFirstTile, worldColumns, 2);
      ctx.fillRect(pixels.x, pixels.y, 2, 2);
      bar.tick();
    })
  );

  readStream.on("end", () => {
    console.log("end");
    PImage.encodePNGToStream(
      img1,
      require("fs").createWriteStream("blockGrid.png")
    )
      .then(() => {
        console.log("wrote out the png file to out.png");
      })
      .catch((e) => {
        console.log("there was an error writing");
      });
  });
};
draw();
