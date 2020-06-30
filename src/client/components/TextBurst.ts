import { Component } from "ecsy";

type TextBurstProps = {
  text?: string | number;
  colorHex: string;
  opacityPercentage: number;
  x: number;
  y: number;
};

export default class TextBurst extends Component<Partial<TextBurstProps>> {
  text?: string | number;
  colorHex = "#FFFFFF";
  opacityPercentage = 100;
  x = 0;
  y = 0;
}
