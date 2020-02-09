import { Component } from "ecsy";

export class Loadable extends Component {
  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
    this.loading = false;
  }
}

export class Unloadable extends Component {
  imagePath?: string;
  dataPath?: string;
  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
  }
}

export class SimpleLoadable extends Component {}
