import { DrawableProperties } from "types/drawable";
import context2d from "../canvas";
import Drawable from "../components/Drawable";
import Fade from "../components/Fade";

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
    offset
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
    offset
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
