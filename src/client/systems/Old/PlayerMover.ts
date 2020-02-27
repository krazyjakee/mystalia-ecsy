import { System, Entity, Not } from "ecsy";
import Drawable from "../../components/Drawable";
import Movement from "../../components/Movement";
import { Loadable, Unloadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import { tileIdToVector } from "../../utilities/TileMap/calculations";

export default class PlayerMover extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), Movement, Drawable]
    }
  };

  execute(delta: number) {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const tileMapDrawable = tileMapEntity.getComponent(Drawable);
      const { width: columns, height: rows } = tileMapDrawable.data;

      // @ts-ignore
      this.queries.player.results.forEach((playerEntity: Entity) => {
        const movement = playerEntity.getComponent(Movement);
        const drawable = playerEntity.getComponent(Drawable);

        const { direction, currentTile, walking, tileQueue } = movement;

        /*
        // TODO: animation component/system to handle this
        if (!direction && !walking) {
          drawable.sourceX = 24;
          return;
        }

        if (timeSinceLastAnimation > 100) {
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

          movement.timeSinceLastAnimation = 0;
        } else {
          movement.timeSinceLastAnimation += delta;
        }
        */

        /*
        // TODO: handle map change in appropriate component
        const { objectTileStore } = tileMap;
        const currentTileVector = tileIdToVector(currentTile, columns);

        if (
          drawable.x - 4 === currentTileVector.x &&
          drawable.y === currentTileVector.y
        ) {
          const tileObject = objectTileStore.get(currentTile);
          if (tileObject && tileObject.type === "door" && tileObject.value) {
            movement.tileQueue = [];
            movement.direction = undefined;
            movement.walking = false;
            tileMapEntity.addComponent(Unloadable, {
              dataPath: `/assets/maps/${tileObject.value.map}.json`
            });
          } else {
            if (direction || tileQueue.length) {
              const nextMap = setNewCurrentTile(
                tileMap,
                movement,
                columns,
                rows,
                movement.direction
              );

              if (nextMap) {
                tileMapEntity.addComponent(Unloadable, {
                  dataPath: `/assets/maps/${nextMap}.json`
                });
              }
            } else {
              tileMap.targetTile = null;
              movement.walking = false;
            }
          }
        }*/
      });
    });
  }
}
