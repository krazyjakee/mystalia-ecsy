import {
  worldSize,
  worldColumns,
  worldFirstTile,
} from "@server/utilities/world";
import { getBlockGrid } from "utilities/movement/aStar";
import { readJSONFile } from "@server/utilities/files";

const drawBlockGrid = (blockList) => {
  const PImage = require("pureimage");
  const img1 = PImage.make(worldSize.width / 16, worldSize.height / 16);
  const blockGrid = getBlockGrid(
    blockList,
    worldSize.height / 32,
    worldColumns,
    worldFirstTile
  );
  var ctx = img1.getContext("2d");
  ctx.fillStyle = "rgba(255,0,0, 0.5)";

  blockGrid.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (col) {
        ctx.fillRect(colIndex * 2, rowIndex * 2, 2, 2);
      }
    });
  });

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
};

drawBlockGrid(readJSONFile("./src/utilities/data/blockList.tmp.json"));
