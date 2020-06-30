import { Component } from "ecsy";

type FadeProps = {
  alpha: number;
};

export default class Fade extends Component<FadeProps> {
  alpha: number = 1;
}
