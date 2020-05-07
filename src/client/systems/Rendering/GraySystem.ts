import { System } from "ecsy";
import TileMap from "@client/components/TileMap";
import { Gray } from "@client/components/Tags";
import context2d from "../../canvas";
import NetworkRoom from "@client/components/NetworkRoom";
import gameState from "../../gameState";
import Weather from "@client/components/Weather";

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
    networkRoom: {
      components: [NetworkRoom],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      tileMapEntity.removeComponent(Weather);

      if (grayScale <= 100) {
        context2d.filter = `grayscale(${grayScale}%)`;
        grayScale += 1;
      } else {
        tileMapEntity.removeComponent(Gray);
      }
    });

    this.queries.loadedTileMaps.removed?.forEach(() => {
      (window as any).ecsyError = true;
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }
}
