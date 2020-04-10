import { System, Not } from "ecsy";
import Fade from "../../components/Fade";
import { Loadable, Unloadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { Gray } from "../../components/Tags";
import context2d from "../../canvas";

let grayScale = 0;

export default class GraySystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [TileMap, Gray],
      listen: {
        added: true,
        removed: true,
      },
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach(() => {
      if (grayScale <= 100) {
        context2d.filter = `grayscale(${grayScale}%)`;
        grayScale += 0.5;
      }
    });

    this.queries.loadedTileMaps.removed?.forEach(() => {
      context2d.filter = `grayscale(0%)`;
    });
  }
}
