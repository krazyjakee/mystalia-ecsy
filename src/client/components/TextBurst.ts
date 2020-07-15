import { Component, Types } from "ecsy";

export default class TextBurst extends Component<TextBurst> {
  static schema = {
    text: { type: Types.String },
    colorHex: { default: "#FFFFFF", type: Types.String },
    opacityPercentage: { default: 100, type: Types.Number },
    x: { default: 0, type: Types.Number },
    y: { default: 0, type: Types.Number },
  };
  text?: string | number;
  colorHex = "#FFFFFF";
  opacityPercentage = 100;
  x = 0;
  y = 0;
}
