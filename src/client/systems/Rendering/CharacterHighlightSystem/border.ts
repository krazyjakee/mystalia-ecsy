import {
  drawImage,
  drawableWithOffset,
  createShadowCanvas,
} from "@client/utilities/drawing";
import { vectorToPixels } from "utilities/tileMap";
import { DrawableProperties } from "types/drawable";
import { Vector } from "types/TMJ";
import { hexToRgb } from "utilities/color";

const [shadowCanvas, shadowContext] = createShadowCanvas();
shadowCanvas.width = 32;
shadowCanvas.height = 32;

export const drawBorderAroundCharacter = (
  drawableProperties: DrawableProperties,
  position: Vector,
  offset: Vector,
  colorHex: string,
  opacityPercentage: number
) => {
  const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];

  shadowContext.clearRect(0, 0, 32, 32);

  const positionPixels = vectorToPixels(position);

  // draw images at offsets from the array scaled by s
  for (let i = 0; i < dArr.length; i += 2) {
    drawImage(
      {
        ...drawableProperties,
        x: dArr[i],
        y: dArr[i + 1],
        offset: { x: 0, y: 0 },
      },
      shadowContext
    );
  }

  shadowContext.save();
  // fill with color
  shadowContext.globalCompositeOperation = "source-in";
  shadowContext.fillStyle = hexToRgb(colorHex, opacityPercentage / 100);
  shadowContext.fillRect(0, 0, 32, 32);

  // draw original image in dest-out mode to keep only the outline
  shadowContext.globalCompositeOperation = "destination-out";

  drawImage(
    {
      ...drawableProperties,
      x: 0,
      y: 0,
      offset: { x: 0, y: 0 },
    },
    shadowContext
  );

  shadowContext.restore();

  drawImage(
    drawableWithOffset(
      {
        ...drawableProperties,
        image: shadowCanvas,
        sourceX: 0,
        sourceY: 0,
      },
      offset,
      positionPixels.x,
      positionPixels.y
    )
  );
};
