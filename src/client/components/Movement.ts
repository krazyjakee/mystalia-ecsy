import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class Movement extends Component {
  direction?: Direction;
  previousDirection?: Direction;
  targetTile?: number;
  currentTile: number = 0;
  moving: boolean = false;
  tileQueue: number[] = [];
  speed: number = 8;

  reset() {
    this.direction = undefined;
    this.previousDirection = undefined;
    this.currentTile = 0;
    this.targetTile = undefined;
    this.moving = false;
    this.tileQueue = [];
    this.speed = 8;
  }
}
