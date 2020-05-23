import { DrawableProperties } from "types/drawable";
import context2d from "../canvas";
import Drawable from "@client/components/Drawable";
import Fade from "@client/components/Fade";
import { Vector } from "types/TMJ";
import addOffset from "./Vector/addOffset";
import { degreeToRadian } from "utilities/math";

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
    offset = { x: 0, y: 0 },
    flipDiagonal,
    flipHorizontal,
    flipVertical,
  } = drawable;

  if (image) {
    const flipped = Boolean(flipDiagonal || flipHorizontal || flipVertical);
    const targetContext = customContext ? customContext : context2d;

    if (flipped) {
      const flippedImage = flipOrRotateImage(drawable);
      if (!flippedImage) return;
      targetContext.drawImage(
        flippedImage,
        0,
        0,
        width,
        height,
        offset.x + x,
        offset.y + y,
        width,
        height
      );
    } else {
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
  }
};

export const flipOrRotateImage = (drawable: DrawableProperties) => {
  const [canvas, context] = createShadowCanvas();
  const {
    image,
    sourceWidth,
    sourceHeight,
    sourceX,
    sourceY,
    width,
    height,
    flipDiagonal,
    flipHorizontal,
    flipVertical,
  } = drawable;

  if (!image) return image;

  let x = 0;
  let y = 0;

  if (flipDiagonal && flipVertical) {
    context.rotate(degreeToRadian(90));
    y -= height;
    context.rotate(degreeToRadian(180));
    x -= width;
    y += height;
  } else if (flipDiagonal) {
    context.rotate(degreeToRadian(90));
    y -= height;
  } else if (flipVertical) {
    context.rotate(degreeToRadian(180));
    x -= width;
    y -= height;
  }
  if (flipHorizontal) {
    context.scale(-1, 1);
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );

  return canvas;
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

export const drawableWithOffset = (
  d: DrawableProperties,
  offset: Vector,
  x?: number,
  y?: number
) => ({
  ...d,
  offset: addOffset(offset, {
    x: x ? x : 0,
    y: y ? y : 0,
  }),
});

export const drawableToDrawableProperties = (drawable: Drawable) => {
  const {
    image = null,
    sourceWidth,
    sourceHeight,
    sourceX,
    sourceY,
    x,
    y,
    width,
    height,
    offset,
  } = drawable;

  const drawableProperties: DrawableProperties = {
    image,
    sourceWidth,
    sourceHeight,
    sourceX,
    sourceY,
    x,
    y,
    width,
    height,
    offset,
  };
  return drawableProperties;
};

export const fadeOverlay = (fade: Fade, fadeIn: boolean = true) => {
  context2d.fillStyle = `rgba(0,0,0,${1 - fade.alpha})`;
  context2d.fillRect(0, 0, context2d.canvas.width, context2d.canvas.height);
  if (fadeIn) {
    fade.alpha += 0.05;
  } else {
    fade.alpha -= 0.05;
  }
};

export const waitForNextFrame = () =>
  new Promise((accept) => {
    requestAnimationFrame(() => {
      accept();
    });
  });

export const createShadowCanvas = (): [
  HTMLCanvasElement,
  CanvasRenderingContext2D
] => {
  const canvas = document.createElement("canvas");
  const shadowContext = canvas.getContext("2d") as CanvasRenderingContext2D;
  return [canvas, shadowContext];
};
