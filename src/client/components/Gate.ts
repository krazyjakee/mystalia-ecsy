import { Component, Types } from "ecsy";

export default class Gate extends Component<Gate> {
  static schema = {
    open: { default: false, type: Types.Boolean },
  };
  open: boolean = false;
}
