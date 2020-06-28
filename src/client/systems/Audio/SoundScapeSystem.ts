// TODO: Use weather to play rain sounds.

import { System, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import Audio, {
  AudioFadeOut,
  Music,
  NextMusic,
} from "@client/components/Audio";
import EnvironmentBrightness from "@client/components/EnvironmentBrightness";
import Weather from "@client/components/Weather";
import TileMap from "@client/components/TileMap";
import { musicAssetPath } from "@client/utilities/assets";

export default class SoundScapeSystem extends System {
  night: null | boolean = null;

  static queries = {
    brightness: {
      components: [EnvironmentBrightness],
    },
    audio: {
      components: [Audio, Music, Not(Loadable)],
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

    const tileMap = tileMapEntity.getComponent(TileMap);

    const audioEntity = this.queries.audio.results[0];
    if (!audioEntity) return;

    const brightnessEntity = this.queries.brightness.results[0];

    const biome = tileMap.properties.biome;

    if (brightnessEntity && biome) {
      const brightnessComponent = brightnessEntity.getComponent(
        EnvironmentBrightness
      );
      const brightness = brightnessComponent.brightness;

      if (this.night === null) {
        this.night = brightness >= 40;
      }

      if (brightness < 40 && !this.night) {
        this.night = true;
        audioEntity.addComponent(NextMusic, {
          audioPath: musicAssetPath(`soundscapes/${biome}Night`),
        });
      } else if (brightness >= 40 && this.night) {
        this.night = false;
        if (tileMap.properties.music) {
          audioEntity.addComponent(NextMusic, {
            audioPath: musicAssetPath(tileMap.properties.music),
          });
        } else {
          audioEntity.addComponent(AudioFadeOut);
        }
      }
    }
  }
}
