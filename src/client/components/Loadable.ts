import { Component } from "ecsy";

export class Loadable extends Component {
  imagePath?: string;
  dataPath?: string;
  loaded: boolean = false;

  constructor() {
    super();
  }
}
