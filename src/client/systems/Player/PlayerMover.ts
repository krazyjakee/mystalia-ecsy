import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import KeyboardInput from "../../components/KeyboardInput";
import PlayerComponent from "../../components/Player";
import Loadable from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToVector } from "../../utilities/TileMap/calculations";
import { setNewCurrentTile } from "../../utilities/Player/playerMovement";

export default class PlayerMover extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), PlayerComponent, Drawable, KeyboardInput]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { width: columns, height: rows } = tileMapDrawable.data;

      // @ts-ignore
      this.queries.player.results.forEach((playerEntity: Entity) => {
        const player = playerEntity.getComponent(PlayerComponent);
        const drawable = playerEntity.getComponent(Drawable);

        const { direction, currentTile, walking, tileQueue } = player;

        if (!direction && !walking) {
          drawable.sourceX = 24;
          return;
        }

        switch (drawable.sourceX) {
          case 0: {
            drawable.sourceX = 24;
            break;
          }
          case 24: {
            drawable.sourceX = 48;
            break;
          }
          case 48: {
            drawable.sourceX = 0;
            break;
          }
        }

        const { objectTileStore } = tileMap;
        const currentTileVector = tileIdToVector(currentTile, columns);

        if (drawable.x < currentTileVector.x) {
          drawable.x += 4;
        }
        if (drawable.x > currentTileVector.x) {
          drawable.x -= 4;
        }
        if (drawable.y > currentTileVector.y) {
          drawable.y -= 4;
        }
        if (drawable.y < currentTileVector.y) {
          drawable.y += 4;
        }

        if (
          drawable.x === currentTileVector.x &&
          drawable.y === currentTileVector.y
        ) {
          const tileObject = objectTileStore.get(currentTile);
          if (tileObject && tileObject.type === "door" && tileObject.value) {
            player.tileQueue = [];
            player.direction = undefined;
            // TODO: Change map logic here
          } else {
            if (direction || tileQueue.length) {
              setNewCurrentTile(
                tileMap,
                player,
                drawable,
                columns,
                rows,
                player.direction
              );
            } else {
              tileMap.targetTile = null;
              player.walking = false;
            }
          }
        }
      });
    });
  }
}
