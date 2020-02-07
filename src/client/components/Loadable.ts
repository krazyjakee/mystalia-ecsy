import { Component } from "ecsy";

export class Loadable extends Component {
  imagePath?: string;
  dataPath?: string;
  loading: boolean = false;

  constructor() {
    super();
  }
}
