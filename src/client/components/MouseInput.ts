import { Component } from "react";
import { Vector } from "types/Grid";

export default class MouseInput extends Component {
  clickedPosition?: Vector;
  cursorPosition?: Vector;
  mouseDownPosition?: Vector;
  mouseDown?: boolean = false;
  enabled: boolean = true;
  bound: boolean = false;

  reset() {
    this.enabled = true;
    this.bound = false;
    this.mouseDown = false;
    this.clickedPosition = undefined;
    this.cursorPosition = undefined;
    this.mouseDownPosition = undefined;
  }
}
