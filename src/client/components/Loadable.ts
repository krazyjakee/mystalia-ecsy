import { Component } from "ecsy";

export class Loadable extends Component {
  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  constructor() {
    super();
  }

  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
    this.loading = false;
  }
}
