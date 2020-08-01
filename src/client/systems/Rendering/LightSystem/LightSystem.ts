import { System, Entity, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import context2d from "../../../canvas";
import Drawable from "@client/components/Drawable";
import addOffset from "../../../utilities/Vector/addOffset";
import LocalPlayer from "@client/components/LocalPlayer";
import Position from "@client/components/Position";
import { drawLightSource } from "./lightRenderFunctions";
import { tileIdToPixels } from "utilities/tileMap";
import { drawImage } from "@client/utilities/drawing";
import { isPresent } from "utilities/guards";
import EnvironmentBrightness from "@client/components/EnvironmentBrightness";

import { hexToRgb } from "utilities/color";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");
const shadowContext = lightCanvas.getContext("2d") as CanvasRenderingContext2D;

const toneCanvas = document.createElement("canvas");
const toneContext = toneCanvas.getContext("2d") as CanvasRenderingContext2D;

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
      const brightnessComponent = tileMapEntity.getComponent(
        EnvironmentBrightness
      );
      const { offset } = tileMapDrawable;

      const minWidth = window.innerWidth;
      const minHeight = window.innerHeight;

      const brightness = isPresent(tileMap.properties.light)
        ? parseInt(tileMap.properties.light)
        : brightnessComponent.brightness;

      lightCanvas.width = minWidth;
      lightCanvas.height = minHeight;

      shadowContext.beginPath();
      shadowContext.fillStyle = `rgba(0,0,0,${1 - 0.01 * brightness})`;
      shadowContext.fillRect(0, 0, minWidth, minHeight);

      //tone layer to remove deep blacks caused by multiply
      toneCanvas.width = minWidth;
      toneCanvas.height = minHeight;

      toneContext.beginPath();
      toneContext.fillStyle = 'rgba(8,8,8,1)';
      toneContext.fillRect(0, 0, minWidth, minHeight);


      if (brightness < 40) {
        this.queries.player.results.forEach((playerEntity: Entity) => {
          const { value } = playerEntity.getComponent(Position);
          const position = addOffset(offset, {
            x: value.x * 32,
            y: value.y * 32,
          });
          drawLightSource(shadowContext, position.x + 16, position.y + 16, {
            radius: 5,
            pulse: false,
            intensity: 30,
            color: "#409ee3",
          });
        });
      }

      if (brightness < 60) {
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
        }
      }

      context2d.globalCompositeOperation = "multiply";
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
      });

      context2d.globalCompositeOperation = "screen";
      drawImage({
        image: toneCanvas,
        sourceX: 0,
        sourceY: 0,
        sourceWidth: minWidth,
        sourceHeight: minHeight,
        x: 0,
        y: 0,
        width: minWidth,
        height: minHeight,
      });

    });
    context2d.restore();
  }
}
