import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class Movement extends Component {
  direction?: Direction;
  previousDirection?: Direction;
  targetTile?: number;
  currentTile: number = 0;
  tileQueue: number[] = [];
  speed: number = 8;
  pathingTo?: number;

  reset() {
    this.direction = undefined;
    this.previousDirection = undefined;
    this.currentTile = 0;
    this.targetTile = undefined;
    this.tileQueue = [];
    this.speed = 8;
    this.pathingTo = undefined;
  }
}
