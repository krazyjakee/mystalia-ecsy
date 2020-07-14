import { Component } from "ecsy";
import { Vector } from "types/TMJ";

export default class Position extends Component<Position> {
  value: Vector = { x: 0, y: 0 };
}
