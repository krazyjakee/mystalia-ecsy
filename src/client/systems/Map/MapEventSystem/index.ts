import { System, Entity, Not } from "ecsy";
import Movement from "../../../components/Movement";
import { Loadable, Unloadable } from "../../../components/Loadable";
import TileMap from "../../../components/TileMap";
import getNextTileData from "./getNextTileData";
import LocalPlayer from "../../../components/LocalPlayer";
import { mapAssetPath } from "../../../utilities/assets";
import loadNewMap from "./loadNewMap";

export default class TileMapObjectListener extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap],
    },
    localPlayer: {
      components: [Not(Loadable), Movement, LocalPlayer],
    },
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const { width: columns, height: rows } = tileMap;

      // @ts-ignore
      this.queries.localPlayer.results.forEach((playerEntity: Entity) => {
        const movement = playerEntity.getComponent(Movement);

        const { direction, currentTile, tileQueue } = movement;

        const { objectTileStore } = tileMap;

        const door = objectTileStore.getByType<"door">(currentTile, "door");
        if (door) {
          movement.tileQueue = [];
          movement.direction = undefined;
          loadNewMap(tileMapEntity, door.value.map);
        } else {
          if (direction || tileQueue.length) {
            const { isEdge, compass } = getNextTileData(
              movement.currentTile,
              rows,
              columns,
              direction
            );

            if (isEdge) {
              const nextMap = tileMap.properties[compass];
              if (nextMap) {
                loadNewMap(tileMapEntity, nextMap);
              }
            }
          } else {
            tileMap.targetTile = null;
          }
        }
      });
    });
  }
}
