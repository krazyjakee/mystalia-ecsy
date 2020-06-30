import { Component } from "ecsy";
import { Vector } from "types/TMJ";

type DrawableProps = {
  image?: CanvasImageSource | HTMLImageElement | null;
  data?: any;
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

export default class Drawable extends Component<Partial<DrawableProps>> {
  image?: CanvasImageSource | HTMLImageElement | null;
  data?: any;
  sourceX: number = 0;
  sourceY: number = 0;
  sourceWidth: number = 0;
  sourceHeight: number = 0;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  offset: Vector = { x: 0, y: 0 };

  reset() {
    this.image = undefined;
    this.data = undefined;
    this.sourceX = 0;
    this.sourceY = 0;
    this.sourceWidth = 0;
    this.sourceHeight = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.offset = { x: 0, y: 0 };
  }
}
