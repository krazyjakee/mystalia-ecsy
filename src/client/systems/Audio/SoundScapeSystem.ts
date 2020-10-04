// TODO: Use weather to play rain sounds.

import { System, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import EnvironmentBrightness from "@client/components/EnvironmentBrightness";
import Weather from "@client/components/Weather";
import { Weather as WeatherType } from "utilities/weather";
import TileMap from "@client/components/TileMap";
import { musicAssetPath } from "@client/utilities/assets";
import { playMusic } from "@client/sound";

export default class SoundScapeSystem extends System {
  night: null | boolean = null;
  weatherActive: null | WeatherType = null;

  static queries = {
    brightness: {
      components: [EnvironmentBrightness],
    },
    weather: {
      components: [Not(Loadable), Weather],
    },
    tileMap: {
      components: [Not(Loadable), TileMap],
    },
  };

  execute() {
    const tileMapEntity = this.queries.tileMap.results[0];
    if (!tileMapEntity) return;

    const weatherEntity = this.queries.weather.results[0];
    if (!weatherEntity) return;

    const tileMap = tileMapEntity.getComponent(TileMap);

    const brightnessEntity = this.queries.brightness.results[0];

    const biome = tileMap.properties.biome;

    const weather = weatherEntity.getComponent(Weather);

    const weatherWithMusic: WeatherType[] = ["lightRain"];
    const priorityWeatherType = weatherWithMusic.find((weatherType) =>
      weather.active.includes(weatherType)
    );
    if (priorityWeatherType) {
      if (this.weatherActive !== priorityWeatherType) {
        this.weatherActive = priorityWeatherType;
        playMusic(musicAssetPath(`soundscapes/${biome}${priorityWeatherType}`));
      }
      return;
    } else {
      this.weatherActive = null;
    }

    if (brightnessEntity && !this.weatherActive) {
      if (biome) {
        const brightnessComponent = brightnessEntity.getComponent(
          EnvironmentBrightness
        );
        const brightness = brightnessComponent.brightness;

        if (this.night === null) {
          this.night = brightness >= 40;
        }

        if (brightness < 40 && !this.night) {
          this.night = true;
          playMusic(musicAssetPath(`soundscapes/${biome}Night`));
        } else if (brightness >= 40 && this.night) {
          this.night = false;
          if (tileMap.properties.music) {
            playMusic(musicAssetPath(tileMap.properties.music));
          }
        }
      } else if (this.night != null) {
        this.night = null;
        if (tileMap.properties.music) {
          playMusic(musicAssetPath(tileMap.properties.music));
        }
      }
    }
  }
}
