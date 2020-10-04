import { Component, Types } from "ecsy";

export class Loadable extends Component<Loadable> {
  static schema = {
    imagePath: { type: Types.String },
    dataPath: { type: Types.String },
    loading: { default: false, type: Types.Boolean },
  };

  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
    this.loading = false;
  }
}

export class Unloadable extends Component<Unloadable> {
  static schema = {
    imagePath: { type: Types.String },
    dataPath: { type: Types.String },
  };

  imagePath?: string;
  dataPath?: string;
  reset() {
    this.imagePath = undefined;
    this.dataPath = undefined;
  }
}

export class SimpleLoadable extends Component<SimpleLoadable> {}
