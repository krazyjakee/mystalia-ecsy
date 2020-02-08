import { DrawableProperties } from "types/drawable";
import context2d from "../canvas";

export const drawImage = (
  drawable: DrawableProperties,
  customContext?: CanvasRenderingContext2D
) => {
  const {
    image,
    sourceWidth,
    sourceHeight,
    sourceX,
    sourceY,
    x,
    y,
    width,
    height,
    offset
  } = drawable;

  if (image) {
    const targetContext = customContext ? customContext : context2d;
    targetContext.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      offset.x + x,
      offset.y + y,
      width,
      height
    );
  }
};

export const drawToShadowCanvas = (
  drawables: DrawableProperties[],
  width: number,
  height: number
): CanvasRenderingContext2D => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const shadowContext = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (shadowContext) {
    for (let i = 0; i < drawables.length; i += 1) {
      const drawable = drawables[i];
      if (drawable) {
        drawImage(drawable, shadowContext);
      }
    }
  }

  return shadowContext;
};
