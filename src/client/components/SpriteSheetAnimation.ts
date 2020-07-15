import { Component, Types } from "ecsy";
import { Vector } from "types/TMJ";

export default class SpriteSheetAnimation extends Component<
  SpriteSheetAnimation
> {
  static schema = {
    step: { default: 0, type: Types.Number },
    steps: { default: [], type: Types.Array },
    restingStep: { default: 0, type: Types.Number },
    speed: { default: 6, type: Types.Number },
    playing: { default: false, type: Types.Boolean },
    timeSinceLastAnimation: { default: 0, type: Types.Number },
    increment: { default: true, type: Types.Boolean },
    loopAround: { default: false, type: Types.Boolean },
  };

  step: number = 0;
  steps: Vector[] = [];
  restingStep: number = 0;
  speed: number = 6;
  playing: boolean = false;
  timeSinceLastAnimation: number = 0;
  increment: boolean = true; // Whether to step forward or backward in animation steps
  loopAround = false; // When finished, decrement step back down again

  reset() {
    this.step = 0;
    this.steps = [];
    this.speed = 6;
    this.restingStep = 0;
    this.playing = false;
    this.timeSinceLastAnimation = 0;
    this.increment = true;
    this.loopAround = false;
  }
}
