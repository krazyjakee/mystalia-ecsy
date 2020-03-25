import { System, Entity, Not } from "ecsy";
import { LightTileType } from "types/TileMap/ObjectTileStore";
import { Loadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToPixels } from "../../utilities/TileMap/calculations";
import context2d from "../../canvas";
import Drawable from "../../components/Drawable";
import addOffset from "../../utilities/Vector/addOffset";
// import gradient from "gradient-color";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");

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

      const largestWidth = Math.max(
        tileMapDrawable.width,
        context2d.canvas.width
      );
      const largestHeight = Math.max(
        tileMapDrawable.height,
        context2d.canvas.height
      );

      lightCanvas.width = largestWidth;
      lightCanvas.height = largestHeight;

      const shadowContext = lightCanvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      if (tileMap.properties.light) {
        shadowContext.beginPath();
        shadowContext.rect(0, 0, largestWidth, largestHeight);
        shadowContext.fillStyle = `rgba(0,0,0,${1 -
          0.01 * parseInt(tileMap.properties.light)})`;
        shadowContext.fill();
      }

      const drawLight = (
        x: number,
        y: number,
        radius: number
        // color: string
      ) => {
        radius = radius * 32;
        const rnd = 0.05 * Math.sin((1.1 * Date.now()) / 1000);
        radius = radius * (1 + rnd);

        shadowContext.drawImage(
          imageMask,
          x - radius,
          y - radius,
          radius * 2,
          radius * 2
        );
      };

      Object.keys(tileMap.objectTileStore.store).forEach(key => {
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
              lightTileProperties.radius
              // lightTileProperties.color || "#292619"
            );
          }
        }
      });

      context2d.save();
      context2d.globalCompositeOperation = "multiply";
      context2d.drawImage(lightCanvas, 0, 0, largestWidth, largestHeight);
      context2d.restore();
    });
  }
}
