import { Component } from "ecsy";
import { Weather as WeatherType } from "utilities/weather";

type WeatherProps = {
  active: WeatherType[];
};

export default class Weather extends Component<WeatherProps> {
  active: WeatherType[] = [];

  reset() {
    this.active = [];
  }
}
