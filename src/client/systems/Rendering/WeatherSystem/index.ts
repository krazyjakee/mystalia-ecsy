import { System, Not } from "ecsy";
import Drawable from "../../../components/Drawable";
import { Loadable } from "../../../components/Loadable";
import TileMap from "../../../components/TileMap";
import drawRain from "./rain";
import { Vector } from "types/TMJ";

let offset: Vector = { x: 0, y: 0 };

export default class WeatherSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      offset.x = tileMapDrawable.offset.x - offset.x;
      offset.y = tileMapDrawable.offset.y - offset.y;
      drawRain(offset);
      offset = { ...tileMapDrawable.offset };
    });
  }
}
