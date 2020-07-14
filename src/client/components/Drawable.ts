import { Component, Types } from "ecsy";
import { Vector } from "types/TMJ";

export default class Drawable extends Component<Drawable> {
  static schema = {
    image: { type: Types.Ref },
    data: { type: Types.JSON },
    sourceX: { default: 0, type: Types.Number },
    sourceY: { default: 0, type: Types.Number },
    sourceWidth: { default: 0, type: Types.Number },
    sourceHeight: { default: 0, type: Types.Number },
    x: { default: 0, type: Types.Number },
    y: { default: 0, type: Types.Number },
    width: { default: 0, type: Types.Number },
    height: { default: 0, type: Types.Number },
    offset: { default: { x: 0, y: 0 }, type: Types.JSON },
  };

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
}
