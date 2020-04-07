import { Component } from "ecsy";

export default class ChangeMap extends Component {
  nextMap: string = "";

  reset() {
    this.nextMap = "";
  }
}
