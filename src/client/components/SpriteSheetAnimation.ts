import { Component } from "ecsy";
import { Vector } from "types/TMJ";

type SpriteSheetAnimationProps = {
  step: number;
  steps: Vector[];
  restingStep: number;
  speed: number;
  playing: boolean;
  timeSinceLastAnimation: number;
  increment: boolean;
  loopAround: boolean;
};

export default class SpriteSheetAnimation extends Component<
  Partial<SpriteSheetAnimationProps>
> {
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
