import { Component } from "ecsy";
import { Vector } from "types/TMJ";

export default class SpriteSheetAnimation extends Component {
  step: number = 0;
  steps: Vector[] = [];
  restingStep: number = 0;
  speed: number = 8;
  playing: boolean = false;
  timeSinceLastAnimation: number = 0;

  reset() {
    this.step = 0;
    this.steps = [];
    this.speed = 8;
    this.restingStep = 0;
    this.playing = false;
    this.timeSinceLastAnimation = 0;
  }
}
