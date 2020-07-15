import { Component, Types } from "ecsy";

export class Loadable extends Component<Loadable> {
  static schema = {
    audioPath: { type: Types.String },
    imagePath: { type: Types.String },
    dataPath: { type: Types.String },
    loading: { default: false, type: Types.Boolean },
  };

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

export class Unloadable extends Component<Unloadable> {
  static schema = {
    audioPath: { type: Types.String },
    imagePath: { type: Types.String },
    dataPath: { type: Types.String },
  };

  audioPath?: string;
  imagePath?: string;
  dataPath?: string;
  reset() {
    this.audioPath = undefined;
    this.imagePath = undefined;
    this.dataPath = undefined;
  }
}

export class SimpleLoadable extends Component<SimpleLoadable> {}
