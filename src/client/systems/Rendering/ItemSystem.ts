import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import { Loadable } from "../../components/Loadable";
import Item from "../../components/Item";
import { tileIdToPixels } from "utilities/tileMap";
import TileMap from "../../components/TileMap";

export default class ItemSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap],
    },
    loadingItems: {
      components: [Not(Loadable), Item],
      listen: {
        added: true,
      },
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);

      this.queries.loadingItems.added?.forEach((itemEntity: Entity) => {
        const drawable = itemEntity.getMutableComponent(Drawable);
        const item = itemEntity.getComponent(Item);

        if (drawable.image && item.tileId && item.sourceTileId) {
          const spriteSheetColumns = (drawable.image.width as number) / 16;
          const drawSourcePosition = tileIdToPixels(
            item.sourceTileId,
            spriteSheetColumns,
            16
          );
          drawable.sourceX = drawSourcePosition.x;
          drawable.sourceY = drawSourcePosition.y;

          const tileMapColumns = tileMapDrawable.data.width;
          const drawPosition = tileIdToPixels(item.tileId, tileMapColumns);
          drawable.x = drawPosition.x + 8;
          drawable.y = drawPosition.y + 8;
        }
      });
    });
  }
}
