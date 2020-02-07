import { Component } from "ecsy";
import { Vector } from "types/Grid";

export class Drawable extends Component {
  resourcePath?: string;
  loaded: boolean = false;

  constructor() {
    super();
  }
}
