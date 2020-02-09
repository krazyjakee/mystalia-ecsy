import { Component } from "react";
import { Direction } from "types/Grid";

export default class KeyboardInput extends Component {
  pressedKeys: string[] = [];
  enabled: boolean = true;
  bound: boolean = false;

  reset() {
    this.enabled = true;
    this.pressedKeys = [];
    this.bound = false;
  }
}
