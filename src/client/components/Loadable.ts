import { Component } from "ecsy";

export class Loadable extends Component {
  audioPath?: string;
  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  reset() {
    this.audioPath = undefined;
    this.imagePath = undefined;
    this.dataPath = undefined;
    this.loading = false;
  }
}

export class Unloadable extends Component {
  audioPath?: string;
  imagePath?: string;
  dataPath?: string;
  reset() {
    this.audioPath = undefined;
    this.imagePath = undefined;
    this.dataPath = undefined;
  }
}

export class SimpleLoadable extends Component {}
