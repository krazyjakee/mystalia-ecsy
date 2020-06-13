import { System } from "ecsy";
import NetworkRoom from "@client/components/NetworkRoom";
import Loot, { UpdateLoot } from "@client/components/Loot";
import TileMap from "@client/components/TileMap";
import { isPresent } from "utilities/guards";
import Drawable from "@client/components/Drawable";
import { getTilesByType } from "utilities/tileMap";
import CreateLoot from "@client/entities/Loot";

export default class LootSystem extends System {
  static queries = {
    tileMaps: {
      components: [TileMap],
    },
    lootUpdates: {
      components: [NetworkRoom, UpdateLoot],
    },
    loot: {
      components: [Loot],
    },
  };

  execute() {
    this.queries.lootUpdates.results.forEach((lootUpdateEntity) => {
      const lootDestroy = () => {
        lootUpdateEntity.removeComponent(UpdateLoot);
      };

      const lootUpdate = lootUpdateEntity.getComponent(UpdateLoot);
      if (!isPresent(lootUpdate.tileId)) {
        lootDestroy();
        return;
      }

      const loot = this.queries.loot.results.find((lootEntity) => {
        const lootComponent = lootEntity.getComponent(Loot);
        return lootComponent.tileId === lootUpdate.tileId;
      });

      if (loot) {
        if (!lootUpdate.items.length) {
          loot.remove();
        } else {
          const lootComponent = loot.getComponent(Loot);
          lootComponent.items = lootUpdate.items;
        }
      } else {
        const tileMapEntity =
          this.queries.tileMaps.results.length &&
          this.queries.tileMaps.results[0];
        if (!tileMapEntity) {
          lootDestroy();
          return;
        }
        const tileMap = tileMapEntity.getComponent(TileMap);
        const tileMapDrawable = tileMapEntity.getComponent(Drawable);

        const allLootTiles = getTilesByType("loot", tileMapDrawable.data);
        const tile = allLootTiles.find(
          (tile) => tile.tileId === lootUpdate.tileId
        );
        if (!tile) {
          lootDestroy();
          return;
        }

        const tileSetSource = tileMapDrawable.data.tilesets.find(
          (tileset) => tileset.firstgid < (tile.gid || 0)
        );
        if (!tileSetSource) {
          lootDestroy();
          return;
        }

        const externalTileSet = tileMap.tileSetStore[tileSetSource?.source];
        CreateLoot(
          tile,
          (tile.gid || 0) - tileSetSource.firstgid,
          lootUpdate.items,
          tileMap.width,
          externalTileSet
        );
      }

      lootDestroy();
    });
  }
}
