import { Component } from "ecsy";
import { Weather as WeatherType } from "utilities/weather";

export default class Weather extends Component<Weather> {
  active: WeatherType[] = [];

  reset() {
    this.active = [];
  }
}
