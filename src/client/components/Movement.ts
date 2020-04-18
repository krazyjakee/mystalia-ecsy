import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class Movement extends Component {
  direction?: Direction;
  targetTile?: number;
  currentTile: number = 0;
  tileQueue: number[] = [];
  speed: number = 6;
  pathingTo?: number;

  reset() {
    this.direction = undefined;
    this.currentTile = 0;
    this.targetTile = undefined;
    this.tileQueue = [];
    this.speed = 6;
    this.pathingTo = undefined;
  }
}
