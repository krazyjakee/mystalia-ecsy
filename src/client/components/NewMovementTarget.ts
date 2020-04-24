import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class NewMovementTarget extends Component {
  targetTile: number = 0;
  mapDir?: Direction;
}
