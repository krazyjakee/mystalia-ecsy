import { Component, Types } from "ecsy";
import { Direction } from "types/Grid";

export default class Movement extends Component<Movement> {
  static schema = {
    direction: { type: Types.String },
    targetTile: { type: Types.Number },
    currentTile: { default: 0, type: Types.Number },
    tileQueue: { default: [], type: Types.Array },
    speed: { default: 6, type: Types.Number },
    pathingTo: { type: Types.Number },
  };

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
