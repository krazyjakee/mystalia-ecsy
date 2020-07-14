import { Component, Types } from "ecsy";
import { Weather as WeatherType } from "utilities/weather";

export default class Weather extends Component<Weather> {
  static schema = {
    direction: { default: [], type: Types.Array },
  };
  active: WeatherType[] = [];

  reset() {
    this.active = [];
  }
}
