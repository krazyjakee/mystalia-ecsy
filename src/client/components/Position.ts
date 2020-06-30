import { Component } from "ecsy";
import { Vector } from "types/TMJ";

type PositionProps = {
  value: Vector;
};

export default class Position extends Component<PositionProps> {
  value: Vector = { x: 0, y: 0 };
}
