import { Vector } from "types/Grid";
import { DrawableProperties } from "types/drawable";

export type AnimatedTileDrawable = {
  uid: number;
  drawable?: DrawableProperties;
  tileSetTileId: number;
};

export type AnimatedTileFrame = {
  drawable?: DrawableProperties;
  sourceTile: Vector;
  interval: number;
};

export type AnimatedTileStore = { [key: number]: AnimatedTileFrame[] };
