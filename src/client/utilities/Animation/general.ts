import { Size } from "types/TileMap/standard";
import { Vector } from "types/TMJ";
import { tileIdToPixels } from "utilities/tileMap";

export const generateAnimationSteps = (
  frameSize: Size,
  imageSize: Size,
  totalFrames: number
) => {
  const columns = Math.floor(imageSize.width / frameSize.width);
  const rows = Math.floor(imageSize.height / frameSize.height);

  let frames: Vector[] = [];
  for (let i = 0; i < totalFrames; i += 1) {
    frames.push(tileIdToPixels(i, columns, frameSize.width));
  }
  return frames;
};
