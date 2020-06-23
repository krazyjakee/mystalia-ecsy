import { tileIdToPixels } from "utilities/tileMap";
import WorldBlockList from "@server/utilities/world/WorldBlockList";
import {
  getWorldSize,
  getWorldFirstTile,
  getWorldColumns,
} from "@server/utilities/world/worldSize";
import { streamArray } from "@server/utilities/streams";

const streamify = require("stream-array");

const ProgressBar = require("progress");

const draw = async () => {
  const PImage = require("pureimage");
  const worldSize = getWorldSize();
  const worldFirstTile = getWorldFirstTile();
  const worldColumns = getWorldColumns();
  const img1 = PImage.make(worldSize.width / 16, worldSize.height / 16);
  var ctx = img1.getContext("2d");
  ctx.fillStyle = "rgba(255,0,0, 0.5)";

  const { blockList } = WorldBlockList.getBlockListsFromZip();
  const bar = new ProgressBar(":bar :current/:total :percent :eta", {
    total: blockList.length,
  });

  const readStream = streamArray(blockList, (data) => {
    const pixels = tileIdToPixels(data - worldFirstTile, worldColumns, 2);
    ctx.fillRect(pixels.x, pixels.y, 2, 2);
    bar.tick();
  });

  readStream.on("end", () => {
    PImage.encodePNGToStream(
      img1,
      require("fs").createWriteStream("blockGrid.png")
    )
      .then(() => {
        console.log("blockGrid.png saved!");
      })
      .catch((e) => {
        console.log("there was an error writing");
      });
  });
};
draw();
