import { Component, Types } from "ecsy";

export default class EnvironmentBrightness extends Component<
  EnvironmentBrightness
> {
  static schema = {
    brightness: { default: 100, type: Types.Number },
    offset: { default: 0, type: Types.Number },
  };
  brightness: number = 100;
  offset: number = 0;
}
