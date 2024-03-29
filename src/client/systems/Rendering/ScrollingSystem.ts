import { System, Entity, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import { Loadable, Unloadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import { TMJ } from "types/TMJ";
import addOffset from "../../utilities/Vector/addOffset";
import setOffsetRelative from "../../utilities/Vector/setOffsetRelative";
import LocalPlayer from "@client/components/LocalPlayer";
import { tileIdToPixels } from "utilities/tileMap";
import config from "@client/config.json";

const { allowableOffMapDistance } = config;

export default class TileMapMover extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Not(Unloadable), Drawable, TileMap],
    },
    player: {
      components: [Not(Loadable), LocalPlayer, Movement, Drawable],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);

      this.queries.player.results.forEach((playerEntity: Entity) => {
        const movement = playerEntity.getComponent(Movement);
        tileMap.targetTile = movement.currentTile;
      });

      const { targetTile } = tileMap;
      if (targetTile) {
        const { width } = tileMapDrawable.data as TMJ;

        const tileVector = tileIdToPixels(targetTile, width);
        const tileVectorOffset = addOffset(tileVector, tileMapDrawable.offset);

        const percentageX = Math.round(
          (tileVectorOffset.x * 100) / window.innerWidth
        );
        const percentageY = Math.round(
          (tileVectorOffset.y * 100) / window.innerHeight
        );

        let offsetX = 0;
        let offsetY = 0;

        if (percentageX > 50) {
          offsetX -= 3;
        }
        if (percentageY > 50) {
          offsetY -= 3;
        }
        if (percentageX < 50) {
          offsetX += 3;
        }
        if (percentageY < 50) {
          offsetY += 3;
        }

        if (
          offsetX === allowableOffMapDistance &&
          offsetY === allowableOffMapDistance
        ) {
          return;
        }

        tileMapDrawable.offset = setOffsetRelative(
          offsetX,
          offsetY,
          tileMapDrawable.offset,
          tileMapDrawable.width,
          tileMapDrawable.height
        );
      }
    });
  }
}
