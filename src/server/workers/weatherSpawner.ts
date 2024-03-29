import MapRoom from "@server/rooms/map";
import WeatherSchema from "@server/db/WeatherSchema";
import { mongoose } from "@colyseus/social";
import { Weather, Biome, biomeWeather, weatherChance } from "utilities/weather";
import { serializeProperties } from "utilities/tileMap";
import WeatherState from "@server/components/weather";
import { ArraySchema } from "@colyseus/schema";
import { randomNumberBetween } from "utilities/math";
import { matchMaker } from "colyseus";
import { saveStateToDb } from "@server/utilities/dbState";

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
      this.biome = mapProperties?.biome;
      if (this.biome) {
        this.presenceKey = `weatherWorker:${this.biome}`;
        this.tick();
      }
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
    if (!matchMaker.presence) return;

    const biomeWorkerExists = await matchMaker.presence.hget(
      `${this.presenceKey}:enabled`,
      "i"
    );
    if (!biomeWorkerExists) {
      console.log(
        `${this.room.roomName} became weather master for the ${this.biome} biome.`
      );
      this.master = true;
      matchMaker.presence.hset(`${this.presenceKey}:enabled`, "i", "i");
      this.loadFromDB();
    } else if (this.master) {
      this.generateWeather();
    } else if (this.presenceKey) {
      matchMaker.presence.subscribe(
        this.presenceKey,
        ({ weathers, duration }) => {
          this.setWeather(weathers, duration);
        }
      );
    }
  }

  masterWatch() {
    matchMaker.presence.subscribe(`${this.presenceKey}:masterDisposed`, () => {
      this.tick();
    });
  }

  generateWeather() {
    if (this.biome) {
      const allWeathers = biomeWeather[this.biome];
      const weathers = allWeathers.filter(
        (weather) => randomNumberBetween(weatherChance[weather]) === 1
      );

      // TODO: Set to 60000 after testing
      const duration = randomNumberBetween(25, 5) * 2000;

      this.setWeather(weathers, duration);
      this.publish(weathers, duration);
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

      // @ts-ignore
      this.timer = setTimeout(() => {
        this.tick();
      }, duration);
    }
  }

  publish(weathers: Weather[], duration: number) {
    if (this.presenceKey) {
      matchMaker.presence.publish(this.presenceKey, { weathers, duration });
    }
  }

  async dispose() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.master) {
      await saveStateToDb(
        "Weather",
        this.room.roomName,
        this.room.state.weather
      );
      matchMaker.presence.del(`${this.presenceKey}:enabled`);
      matchMaker.presence.publish(`${this.presenceKey}:masterDisposed`, "1");
    }
  }
}
