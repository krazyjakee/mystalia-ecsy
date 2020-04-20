import MapRoom from "@server/rooms/map";
import WeatherSchema from "@server/db/WeatherSchema";
import { mongoose } from "@colyseus/social";
import { Weather, Biome, biomeWeather, weatherChance } from "utilities/weather";
import { serializeProperties } from "utilities/tileMap";
import WeatherState from "@server/components/weather";
import { ArraySchema } from "@colyseus/schema";

export default class WeatherSpawner {
  room: MapRoom;
  master: boolean = false;
  weathers: Weather[] = [];
  timer?: NodeJS.Timeout;
  presenceKey?: string;
  biome?: Biome;

  constructor(room: MapRoom) {
    this.room = room;
    const mapData = this.room.mapData;
    if (mapData) {
      const mapProperties = serializeProperties<"mapProps">(mapData.properties);
      this.biome = mapProperties?.biome || "forest";
      this.presenceKey = `weatherWorker:${this.biome}`;
      this.tick();
    }
  }

  loadFromDB() {
    const weathers = mongoose.model("Weather", WeatherSchema);
    weathers.find({ biome: this.biome }, (err, res) => {
      if (err) return console.log(err.message);
      const biomeWeather = res[0];
      if (biomeWeather) {
        const obj = biomeWeather.toJSON();
        if (obj.weathers && obj.duration) {
          this.setWeather(obj.weathers, obj.duration);
          return;
        }
      }
      this.generateWeather();
    });
  }

  async tick() {
    const biomeWorkerExists = await this.room.presence.hget(
      `${this.presenceKey}:enabled`,
      "i"
    );
    if (!biomeWorkerExists) {
      this.master = true;
      this.room.presence.hset(`${this.presenceKey}:enabled`, "i", "i");
      this.loadFromDB();
    } else if (this.master) {
      this.generateWeather();
    } else if (this.presenceKey) {
      this.room.presence.subscribe(
        this.presenceKey,
        ({ weathers, duration }) => {
          this.setWeather(weathers, duration);
        }
      );
    }
  }

  generateWeather() {
    if (this.biome) {
      const allWeathers = biomeWeather[this.biome];
      const weathers = allWeathers.filter(
        (weather) =>
          Math.floor(Math.random() * weatherChance[weather]) + 1 === 1
      );
      const duration = Math.floor(Math.random() * 25) + 5;
      // TODO: Set to 60000 after testing
      this.setWeather(weathers, duration * 2000);
    }
  }

  setWeather(weathers: Weather[], duration: number) {
    if (this.presenceKey && this.biome) {
      if (!this.room.state.weather[this.biome]) {
        this.room.state.weather[this.biome] = new WeatherState(
          this.biome,
          weathers,
          duration
        );
      } else {
        this.room.state.weather[this.biome].weathers = new ArraySchema<Weather>(
          ...weathers
        );
        this.room.state.weather[this.biome].duration = duration;
      }

      this.room.presence.publish(this.presenceKey, { weathers, duration });

      // @ts-ignore
      this.timer = setTimeout(() => {
        this.tick();
      }, duration);
    }
  }

  dispose() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.room.presence.del(`${this.presenceKey}:enabled`);
  }
}
