import { System, Not } from "ecsy";
import TextBurst from "@client/components/TextBurst";
import TileMap from "@client/components/TileMap";
import Position from "@client/components/Position";
import Drawable from "@client/components/Drawable";
import { Loadable } from "@client/components/Loadable";
import context2d from "@client/canvas";
import addOffset from "@client/utilities/Vector/addOffset";
import { vectorToPixels } from "utilities/tileMap";

export default class TextBurstSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    textBurstEntities: {
      components: [TextBurst],
      listen: {
        added: true,
      },
    },
  };

  execute() {
    const tileMapEntity =
      this.queries.loadedTileMaps.results.length &&
      this.queries.loadedTileMaps.results[0];
    if (!tileMapEntity) return;
    const { offset } = tileMapEntity.getComponent(Drawable);

    this.queries.textBurstEntities.added?.forEach((entity) => {
      const textBurst = entity.getMutableComponent(TextBurst);
      if (textBurst) {
        textBurst.x += Math.floor(Math.random() * 24);
      }
    });

    this.queries.textBurstEntities.results.forEach((entity) => {
      const textBurst = entity.getMutableComponent(TextBurst);
      if (!textBurst.text) return;

      textBurst.y -= 0.3;
      textBurst.opacityPercentage -= 2;

      context2d.save();
      context2d.globalAlpha = textBurst.opacityPercentage / 100;
      context2d.font = "11px Tahoma";
      context2d.fillStyle = textBurst.colorHex;
      context2d.lineWidth = 1;

      const textPosition = addOffset(offset, textBurst);
      context2d.strokeText(textBurst.text, textPosition.x, textPosition.y);
      context2d.fillText(textBurst.text, textPosition.x, textPosition.y);
      context2d.restore();

      if (textBurst.opacityPercentage <= 0) {
        entity.remove();
      }
    });
  }
}
