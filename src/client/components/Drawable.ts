import { Component } from "ecsy";
import { Vector } from "types/Grid";

export class Drawable extends Component {
  image?: CanvasImageSource;
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

  constructor() {
    super();
  }
}
