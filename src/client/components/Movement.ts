import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class Movement extends Component {
  direction?: Direction;
  previousDirection?: Direction;
  currentTile: number = 0;
  targetTile: number = -1;
  walking: boolean = false;
  tileQueue: number[] = [];
  speed: number = 5;

  reset() {
    this.direction = undefined;
    this.previousDirection = undefined;
    this.currentTile = 0;
    this.targetTile = -1;
    this.walking = false;
    this.tileQueue = [];
    this.speed = 2;
  }
}
