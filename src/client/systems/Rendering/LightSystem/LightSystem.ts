import { System, Entity, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import context2d from "../../../canvas";
import Drawable from "@client/components/Drawable";
import addOffset from "../../../utilities/Vector/addOffset";
import LocalPlayer from "@client/components/LocalPlayer";
import Position from "@client/components/Position";
import { drawLightSource, calculateBrightness } from "./lightRenderFunctions";
import { tileIdToPixels } from "utilities/tileMap";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");

export default class LightSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap, Drawable],
    },
    player: {
      components: [Not(Loadable), LocalPlayer],
    },
  };

  execute() {
    context2d.save();
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
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

      const environmentLight =
        !!tileMap.properties.light && parseInt(tileMap.properties.light);

      // TODO: brightness should not be calculated on the fly, there should be a system to store it for flamesystem and this one.
      const brightness = calculateBrightness(environmentLight);

      shadowContext.beginPath();
      shadowContext.rect(0, 0, largestWidth, largestHeight);
      shadowContext.fillStyle = `rgba(0,0,0,${1 - 0.01 * brightness})`;
      shadowContext.fill();

      if (!environmentLight || environmentLight < 40) {
        this.queries.player.results.forEach((playerEntity: Entity) => {
          const { value } = playerEntity.getComponent(Position);
          const position = addOffset(offset, {
            x: value.x * 32,
            y: value.y * 32,
          });
          drawLightSource(shadowContext, position.x + 16, position.y + 16, {
            radius: 4,
            pulse: false,
            intensity: 30,
            color: "#ffffff",
          });
        });
      }

      if (environmentLight || (!environmentLight && brightness < 60)) {
        Object.keys(tileMap.objectTileStore.store).forEach((key) => {
          const tileId = parseInt(key);
          const tilePosition = tileIdToPixels(tileId, tileMap.width);
          const lightTile = tileMap.objectTileStore.getByType<"light">(
            tileId,
            "light"
          );
          if (lightTile && lightTile.value) {
            const lightTileProperties = lightTile.value;

            if (lightTile.type === "light") {
              const position = addOffset(offset, tilePosition);
              let intensity = lightTileProperties.intensity;
              if (!intensity) {
                if (brightness && brightness >= 50) {
                  intensity = 100 - (brightness - 50) * 2;
                }
              }

              drawLightSource(shadowContext, position.x + 16, position.y + 16, {
                radius: lightTileProperties.radius,
                color: lightTileProperties.color,
                intensity,
              });
            }
          }
        });
      }

      context2d.globalCompositeOperation = "multiply";
      context2d.drawImage(lightCanvas, 0, 0, largestWidth, largestHeight);
    });
    context2d.restore();
  }
}
