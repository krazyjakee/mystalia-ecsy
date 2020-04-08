import { System, Entity, Not } from "ecsy";
import Movement from "../../components/Movement";
import { Loadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";
import LocalPlayer from "../../components/LocalPlayer";
import ChangeMap from "../../components/ChangeMap";
import { StaticQuery } from "types/ecsy";

export default class TileMapObjectListener extends System {
  static queries: StaticQuery = {
    loadedTileMaps: {
      components: [Not(Loadable), TileMap],
    },
    localPlayer: {
      components: [Not(Loadable), Movement, LocalPlayer],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const { width: columns, height: rows } = tileMap;

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
          playerEntity.addComponent(ChangeMap, { nextMap: door.value.map });
        }
      });
    });
  }
}
