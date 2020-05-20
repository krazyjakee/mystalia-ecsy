import { Component } from "ecsy";
import { Direction } from "types/Grid";

export default class ChangeMap extends Component {
  nextMap: string = "";
  tileId?: number;

  reset() {
    this.nextMap = "";
    this.tileId = undefined;
  }
}
