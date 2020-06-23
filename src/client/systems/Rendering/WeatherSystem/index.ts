import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import Weather from "@client/components/Weather";
import drawRain from "./rain";
import drawCloud from "./cloud";
import { Vector } from "types/TMJ";
import EnvironmentBrightness from "@client/components/EnvironmentBrightness";

let rainOffset: Vector = { x: 0, y: 0 };

export default class WeatherSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap, Weather],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { active } = tileMapEntity.getComponent(Weather);
      const brightnessComponent = tileMapEntity.getMutableComponent(
        EnvironmentBrightness
      );

      rainOffset.x = tileMapDrawable.offset.x - rainOffset.x;
      rainOffset.y = tileMapDrawable.offset.y - rainOffset.y;
      if (active.includes("cloudy")) {
        drawCloud(tileMapDrawable.offset, tileMapDrawable);
      }
      if (active.includes("lightRain")) {
        drawRain(rainOffset);
        brightnessComponent.offset = -10;
      } else if (active.includes("heavyRain")) {
        drawRain(rainOffset, true);
        brightnessComponent.offset = -20;
      } else {
        brightnessComponent.offset = 0;
      }
      rainOffset = { ...tileMapDrawable.offset };
    });
  }
}
