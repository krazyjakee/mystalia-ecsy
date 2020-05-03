import {
  drawImage,
  drawableWithOffset,
  createShadowCanvas,
} from "@client/utilities/drawing";
import { vectorToPixels } from "utilities/tileMap";
import { DrawableProperties } from "types/drawable";
import { Vector } from "types/TMJ";
import { hexToRgb } from "utilities/color";
import context2d from "@client/canvas";

const [shadowCanvas, shadowContext] = createShadowCanvas();
shadowCanvas.width = 32;
shadowCanvas.height = 32;

export const drawFlashOnCharacter = (
  drawableProperties: DrawableProperties,
  position: Vector,
  offset: Vector,
  colorHex: string,
  opacityPercentage: number
) => {
  shadowContext.clearRect(0, 0, 32, 32);

  const positionPixels = vectorToPixels(position);

  shadowContext.save();
  shadowContext.globalCompositeOperation = "multiply";
  shadowContext.fillStyle = colorHex;
  shadowContext.fillRect(0, 0, 32, 32);
  shadowContext.globalAlpha = opacityPercentage / 100;
  shadowContext.globalCompositeOperation = "destination-in";

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

  context2d.save();
  context2d.globalAlpha = opacityPercentage / 100;

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

  context2d.restore();
};
