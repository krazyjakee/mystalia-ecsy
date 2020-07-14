import { Component } from "ecsy";

export default class TextBurst extends Component<TextBurst> {
  text?: string | number;
  colorHex = "#FFFFFF";
  opacityPercentage = 100;
  x = 0;
  y = 0;
}
