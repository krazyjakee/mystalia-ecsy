import { System } from "ecsy";
import TileMap from "../../components/TileMap";
import { Gray } from "../../components/Tags";
import context2d from "../../canvas";
import NetworkRoom from "../../components/NetworkRoom";
import gameState from "../../gameState";

let grayScale = 0;

export default class GraySystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [TileMap, Gray],
      listen: {
        added: true,
        removed: true
      }
    },
    networkRoom: {
      components: [NetworkRoom]
    }
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach(tileMapEntity => {
      if (grayScale <= 100) {
        context2d.filter = `grayscale(${grayScale}%)`;
        grayScale += 0.5;
      } else {
        tileMapEntity.removeComponent(Gray);
      }
    });

    this.queries.loadedTileMaps.removed?.forEach(() => {
      (window as any).ecsyError = true;
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  }
}
