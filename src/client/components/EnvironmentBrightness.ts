import { Component } from "ecsy";

type EnvironmentBrightnessProps = {
  brightness: number;
  offset: number;
};

export default class EnvironmentBrightness extends Component<
  EnvironmentBrightnessProps
> {
  brightness: number = 100;
  offset: number = 0;
}
