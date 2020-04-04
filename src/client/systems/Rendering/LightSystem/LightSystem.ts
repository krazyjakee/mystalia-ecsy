import { System, Entity, Not } from "ecsy";
import { Loadable } from "../../../components/Loadable";
import TileMap from "../../../components/TileMap";
import context2d from "../../../canvas";
import Drawable from "../../../components/Drawable";
import addOffset from "../../../utilities/Vector/addOffset";
import LocalPlayer from "../../../components/LocalPlayer";
import Position from "../../../components/Position";
import { drawLightSource } from "./lightRenderFunctions";
import config from "../../../config.json";
import { timeOfDayAsPercentage } from "../../../utilities/time";
import { tileIdToPixels } from "utilities/tileMap";
// import gradient from "gradient-color";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");

const { dayLightPercentage } = config;

export default class LightSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap, Drawable]
    },
    player: {
      components: [Not(Loadable), LocalPlayer]
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

      const environmentLight =
        tileMap.properties.light && parseInt(tileMap.properties.light);
      let brightness = 0;

      if (environmentLight) {
        brightness = environmentLight;
      } else {
        const dayPercentage = timeOfDayAsPercentage();

        if (dayPercentage < dayLightPercentage) {
          const phaseProgress = (100 / dayLightPercentage) * dayPercentage;
          if (phaseProgress < 20) {
            brightness = 80 + phaseProgress;
          } else if (phaseProgress > 80) {
            brightness = 100 - (phaseProgress - 80);
          } else {
            brightness = 100;
          }
        } else {
          const phaseProgress =
            100 - (100 / (100 - dayLightPercentage)) * (100 - dayPercentage);
          if (phaseProgress < 40) {
            brightness = 80 - phaseProgress * 2;
          } else if (phaseProgress > 60) {
            brightness = (phaseProgress - 60) * 2;
          } else {
            brightness = 0;
          }
        }
      }

      shadowContext.beginPath();
      shadowContext.rect(0, 0, largestWidth, largestHeight);
      shadowContext.fillStyle = `rgba(0,0,0,${1 - 0.01 * brightness})`;
      shadowContext.fill();

      if (!environmentLight || environmentLight < 40) {
        // @ts-ignore
        this.queries.player.results.forEach((playerEntity: Entity) => {
          const { value } = playerEntity.getComponent(Position);
          const position = addOffset(offset, {
            x: value.x * 32,
            y: value.y * 32
          });
          drawLightSource(shadowContext, position.x + 16, position.y + 16, {
            radius: 4,
            pulse: false,
            intensity: 30,
            color: "#ffffff"
          });
        });
      }

      Object.keys(tileMap.objectTileStore.store).forEach(key => {
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
              intensity
            });
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
