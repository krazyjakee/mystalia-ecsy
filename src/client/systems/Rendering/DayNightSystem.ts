import { System, Entity, Not } from "ecsy";
import { LightTileType } from "types/TileMap/ObjectTileStore";
import { Loadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToPixels } from "../../utilities/TileMap/calculations";
import context2d from "../../canvas";
import Drawable from "../../components/Drawable";
import addOffset from "../../utilities/Vector/addOffset";
import Position from "../../components/Position";
import LocalPlayer from "../../components/LocalPlayer";
// import gradient from "gradient-color";

const imageMask = new Image();
imageMask.src = "/assets/utilities/lightmask.png";

const lightCanvas = document.createElement("canvas");

const dayLengthInMinutes = 5;
const dayLightPercentage = 66;

export default class DayNightSystem extends System {
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

      if (tileMap.properties.light) {
        return;
      }

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

      const utcTime =
        new Date(new Date().toUTCString()).getTime() +
        new Date().getUTCMilliseconds();
      const minutesInMs = 1000 * 60 * dayLengthInMinutes;
      const dayPercentage = ((utcTime / minutesInMs) % 1) * 100;
      let brightness = 0;

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

      shadowContext.beginPath();
      shadowContext.rect(0, 0, largestWidth, largestHeight);
      shadowContext.fillStyle = `rgba(0,0,0,${1 - 0.01 * brightness})`;
      shadowContext.fill();

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

      // @ts-ignore
      this.queries.player.results.forEach((playerEntity: Entity) => {
        const { value } = playerEntity.getComponent(Position);
        const position = addOffset(offset, {
          x: value.x * 32,
          y: value.y * 32
        });
        drawLight(position.x + 16, position.y + 16, 6);
      });

      Object.keys(tileMap.objectTileStore.store).forEach(key => {
        const tileId = parseInt(key);
        const tilePosition = tileIdToPixels(tileId, tileMap.width);
        const lightTile = tileMap.objectTileStore.getByType<LightTileType>(
          tileId,
          "light"
        );
        if (lightTile && lightTile.value) {
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
