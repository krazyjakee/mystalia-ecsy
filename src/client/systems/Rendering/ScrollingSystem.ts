import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import Movement from "../../components/Movement";
import { Loadable, Unloadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { TMJ } from "types/TMJ";
import addOffset from "../../utilities/Vector/addOffset";
import setOffsetRelative from "../../utilities/Vector/setOffsetRelative";
import LocalPlayer from "../../components/LocalPlayer";
import { tileIdToPixels } from "utilities/tileMap";

export default class TileMapMover extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Not(Unloadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), LocalPlayer, Movement, Drawable]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);

      // @ts-ignore
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
          offsetX -= 4;
        }
        if (percentageY > 50) {
          offsetY -= 4;
        }
        if (percentageX < 50) {
          offsetX += 4;
        }
        if (percentageY < 50) {
          offsetY += 4;
        }

        if (offsetX === 0 && offsetY === 0) {
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
