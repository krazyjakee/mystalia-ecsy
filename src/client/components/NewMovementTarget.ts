import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class NewMovementTarget extends Component<NewMovementTarget> {
  targetTile: number = 0;
  mapDir?: Direction;
}
