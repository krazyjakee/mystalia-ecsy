import { Component } from "ecsy";

export default class Loadable extends Component {
  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
    this.loading = false;
  }
}
