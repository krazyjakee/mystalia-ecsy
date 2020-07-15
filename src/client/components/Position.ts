import { Component, Types } from "ecsy";
import { Vector } from "types/TMJ";

export default class Position extends Component<Position> {
  static schema = {
    value: { default: { x: 0, y: 0 }, type: Types.JSON },
  };
  value: Vector = { x: 0, y: 0 };
}
