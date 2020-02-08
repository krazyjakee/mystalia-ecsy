import { Component } from "react";
import { Direction } from "types/Grid";

export default class KeyboardInput extends Component {
  direction?: Direction;
  pressedKeys: string[] = [];
  enabled: boolean = true;
  bound: boolean = false;

  reset() {
    this.enabled = true;
    this.direction = undefined;
    this.pressedKeys = [];
    this.bound = false;
  }
}
