import { System, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import Drawable from "@client/components/Drawable";
import { TMJ } from "types/TMJ";
import { flameOn } from "./flameRenderFunctions";
import context2d from "../../../canvas";
import { calculateBrightness } from "./lightRenderFunctions";

const finalCanvas = document.createElement("canvas");
const finalCanvasContext = finalCanvas.getContext(
  "2d"
) as CanvasRenderingContext2D;

export default class FlameSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap, Drawable],
      listen: {
        added: true,
      },
    },
  };

  execute() {
    this.queries.loadedTileMaps.added?.forEach((tileMapEntity) => {
      const drawable = tileMapEntity.getComponent(Drawable);
      const data = drawable.data as TMJ;

      finalCanvas.width = drawable.width;
      finalCanvas.height = drawable.height;

      finalCanvasContext.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

      for (const layer of data.layers) {
        if (layer.type !== "tilelayer") {
          layer.objects
            ?.filter((obj) => obj.type === "flame")
            .forEach((obj) => {
              const { x, y } = obj;

              const pData = flameOn(obj);

              if (pData) {
                finalCanvasContext.drawImage(pData, x, y);
              }
            });
        }
      }
    });

    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const drawable = tileMapEntity.getComponent(Drawable);
      const tileMap = tileMapEntity.getComponent(TileMap);
      const { offset } = drawable;

      const environmentLight =
        !!tileMap.properties.light && parseInt(tileMap.properties.light);

      const brightness = calculateBrightness(environmentLight);

      if (brightness < 60) {
        context2d.drawImage(
          finalCanvas,
          0 - offset.x,
          0 - offset.y,
          context2d.canvas.width,
          context2d.canvas.height,
          0,
          0,
          context2d.canvas.width,
          context2d.canvas.height
        );
      }
    });
  }
}
