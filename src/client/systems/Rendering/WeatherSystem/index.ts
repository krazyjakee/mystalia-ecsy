import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import Weather from "@client/components/Weather";
import drawRain from "./rain";
import drawCloud from "./cloud";
import { Vector } from "types/TMJ";
import context2d from "@client/canvas";

let rainOffset: Vector = { x: 0, y: 0 };

const drawOvercast = (opacity: number) => {
  context2d.save();
  context2d.fillStyle = `rgba(0,0,0,${opacity})`;
  context2d.beginPath();
  context2d.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context2d.closePath();
  context2d.restore();
};

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
      rainOffset.x = tileMapDrawable.offset.x - rainOffset.x;
      rainOffset.y = tileMapDrawable.offset.y - rainOffset.y;
      if (active.includes("cloudy")) {
        drawCloud(tileMapDrawable.offset, tileMapDrawable);
      }
      if (active.includes("lightRain")) {
        drawRain(rainOffset);
        // TODO: Fade in the overcast
        drawOvercast(0.1);
      } else if (active.includes("heavyRain")) {
        drawRain(rainOffset, true);
        drawOvercast(0.2);
      }
      rainOffset = { ...tileMapDrawable.offset };
    });
  }
}
