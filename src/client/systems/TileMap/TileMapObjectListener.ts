import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import Movement from "../../components/Movement";
import { Loadable, Unloadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToVector } from "../../utilities/TileMap/calculations";
import { getNextTileData } from "../../utilities/Movement/movement";

export default class TileMapObjectListener extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), Movement, Drawable]
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
        const movement = playerEntity.getComponent(Movement);

        const { direction, currentTile, tileQueue } = movement;

        const { objectTileStore } = tileMap;

        const tileObject = objectTileStore.get(currentTile);
        if (tileObject && tileObject.type === "door" && tileObject.value) {
          movement.tileQueue = [];
          movement.direction = undefined;
          movement.moving = false;
          tileMapEntity.addComponent(Unloadable, {
            dataPath: `/assets/maps/${tileObject.value.map}.json`
          });
        } else {
          if (direction || tileQueue.length) {
            const { isEdge, compass } = getNextTileData(
              movement,
              rows,
              columns,
              direction
            );

            if (isEdge) {
              const nextMap = tileMap.properties[compass];
              tileMapEntity.addComponent(Unloadable, {
                dataPath: `/assets/maps/${nextMap}.json`
              });
            }
          } else {
            tileMap.targetTile = null;
            movement.moving = false;
          }
        }
      });
    });
  }
}
