import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class ChangeMap extends Component {
  nextMap: string = "";
  direction?: Direction;

  reset() {
    this.nextMap = "";
    this.direction = undefined;
  }
}
