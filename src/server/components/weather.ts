import { Schema, type, ArraySchema } from "@colyseus/schema";
import { Biome, Weather } from "utilities/weather";

export default class WeatherState extends Schema {
  @type("string")
  biome: Biome;

  @type(["string"])
  weathers: ArraySchema<Weather>;

  @type("number")
  duration: number;

  constructor(biome: Biome, weathers: Weather[], duration: number) {
    super();
    this.biome = biome;
    this.weathers = new ArraySchema<Weather>(...weathers);
    this.duration = duration;
  }
}
