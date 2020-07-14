import { Component, Types } from "ecsy";

export default class Fade extends Component<Fade> {
  static schema = {
    alpha: { default: 1, type: Types.Number },
  };
  alpha: number = 1;
}
