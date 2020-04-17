import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import Weather from "@client/components/Weather";
import drawRain from "./rain";
import { Vector } from "types/TMJ";

let offset: Vector = { x: 0, y: 0 };

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
      offset.x = tileMapDrawable.offset.x - offset.x;
      offset.y = tileMapDrawable.offset.y - offset.y;
      if (active.includes("lightRain")) {
        drawRain(offset);
      } else if (active.includes("heavyRain")) {
        drawRain(offset, true);
      }
      offset = { ...tileMapDrawable.offset };
    });
  }
}
