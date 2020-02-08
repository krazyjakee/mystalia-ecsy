import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class Player extends Component {
  direction: Direction | null = null;
  currentTile: number = 0;
  targetTile: number = 0;
  walking: boolean = false;
  tileQueue: number[] = [];

  reset() {
    this.direction = null;
    this.currentTile = 0;
    this.targetTile = 0;
    this.walking = false;
    this.tileQueue = [];
  }
}
