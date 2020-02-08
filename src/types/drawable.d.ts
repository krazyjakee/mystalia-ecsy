import { Vector } from "./Grid";

export type DrawableProperties = {
  name?: string;
  image: CanvasImageSource | HTMLImageElement | null;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  offset: Vector;
};
