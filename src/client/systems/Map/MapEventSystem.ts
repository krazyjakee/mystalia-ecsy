import { System, Entity, Not } from "ecsy";
import Movement from "@client/components/Movement";
import { Loadable } from "@client/components/Loadable";
import TileMap from "@client/components/TileMap";
import LocalPlayer from "@client/components/LocalPlayer";
import gameState from "@client/gameState";

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
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      // const { width: columns, height: rows } = tileMap;

      this.queries.localPlayer.results.forEach((playerEntity: Entity) => {
        const movement = playerEntity.getComponent(Movement);

        const { objectTileStore } = tileMap;

        const door = objectTileStore.getByType<"door">(
          movement.currentTile,
          "door"
        );
        if (door) {
          movement.tileQueue = [];
          movement.direction = undefined;
          gameState.send("map", "localPlayer:movement:walkOff");
        }
      });
    });
  }
}
