import { System, Entity, Not } from "ecsy";
import { LightTileType } from "types/TileMap/ObjectTileStore";
import { Loadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToPixels } from "../../utilities/TileMap/calculations";
import context2d from "../../canvas";
import Drawable from "../../components/Drawable";
import addOffset from "../../utilities/Vector/addOffset";
import gradient from "gradient-color";

export default class LightSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap, Drawable]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { offset } = tileMapDrawable;

      const drawLight = (
        x: number,
        y: number,
        radius: number,
        color: string
      ) => {
        const colors = gradient([color, "#000"], 10);

        radius = radius * 32;
        context2d.save();
        context2d.globalCompositeOperation = "lighter";
        const rnd = 0.05 * Math.sin((1.1 * Date.now()) / 1000);
        radius = radius * (1 + rnd);
        const radialGradient = context2d.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius
        );
        radialGradient.addColorStop(0.0, colors[0]);
        radialGradient.addColorStop(0.2 + rnd, colors[1]);
        radialGradient.addColorStop(0.7 + rnd, colors[6]);
        radialGradient.addColorStop(0.9, colors[8]);
        radialGradient.addColorStop(1, colors[9]);
        context2d.fillStyle = radialGradient;
        context2d.beginPath();
        context2d.arc(x, y, radius, 0, 2 * Math.PI);
        context2d.fill();
        context2d.restore();
      };

      Object.keys(tileMap.objectTileStore.store).map(key => {
        const tileId = parseInt(key);
        const tilePosition = tileIdToPixels(tileId, tileMap.width);
        const lightTile = tileMap.objectTileStore.store[tileId];
        if (lightTile.value) {
          const lightTileProperties = lightTile.value as LightTileType;

          if (lightTile.type === "light") {
            const position = addOffset(offset, tilePosition);
            drawLight(
              position.x + 16,
              position.y + 16,
              lightTileProperties.radius,
              "#615524"
            );
          }
        }
      });
    });
  }
}
