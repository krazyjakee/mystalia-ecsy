import { LayerType } from "types/TMJ";
import { Component } from "ecsy";

export class Layer extends Component {
  type?: LayerType;

  constructor() {
    super();
  }
}

export class Tile extends Component {}
