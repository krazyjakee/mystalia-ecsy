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
import { drawImage } from "@client/utilities/drawing";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");
const shadowContext = lightCanvas.getContext("2d") as CanvasRenderingContext2D;

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

      lightCanvas.width = tileMapDrawable.width;
      lightCanvas.height = tileMapDrawable.height;

      const environmentLight =
        !!tileMap.properties.light && parseInt(tileMap.properties.light);

      // TODO: brightness should not be calculated on the fly, there should be a system to store it for flamesystem and this one.
      const brightness = calculateBrightness(environmentLight);

      shadowContext.beginPath();
      shadowContext.fillStyle = `rgba(0,0,0,${1 - 0.01 * brightness})`;
      shadowContext.fillRect(
        0,
        0,
        tileMapDrawable.width,
        tileMapDrawable.height
      );

      if (!environmentLight || environmentLight < 40) {
        this.queries.player.results.forEach((playerEntity: Entity) => {
          const { value } = playerEntity.getComponent(Position);
          const position = {
            x: value.x * 32,
            y: value.y * 32,
          };
          drawLightSource(shadowContext, position.x + 16, position.y + 16, {
            radius: 4,
            pulse: false,
            intensity: 30,
            color: "#ffffff",
          });
        });
      }

      if (environmentLight || (!environmentLight && brightness < 60)) {
        for (let key in tileMap.objectTileStore.store) {
          const tileId = parseInt(key);
          const tilePosition = tileIdToPixels(tileId, tileMap.width);
          const lightTile = tileMap.objectTileStore.getByType<"light">(
            tileId,
            "light"
          );
          if (lightTile && lightTile.value) {
            const lightTileProperties = lightTile.value;

            if (lightTile.type === "light") {
              let intensity = lightTileProperties.intensity;
              if (!intensity) {
                if (brightness && brightness >= 50) {
                  intensity = 100 - (brightness - 50) * 2;
                }
              }

              drawLightSource(
                shadowContext,
                tilePosition.x + 16,
                tilePosition.y + 16,
                {
                  radius: lightTileProperties.radius,
                  color: lightTileProperties.color,
                  intensity,
                }
              );
            }
          }
        }
      }

      context2d.globalCompositeOperation = "multiply";

      const minWidth = Math.min(tileMapDrawable.width, window.innerWidth);
      const minHeight = Math.min(tileMapDrawable.height, window.innerHeight);

      drawImage({
        image: lightCanvas,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: minWidth,
        sourceHeight: minHeight,
        x: 0,
        y: 0,
        width: minWidth,
        height: minHeight,
        offset,
      });
    });
    context2d.restore();
  }
}
