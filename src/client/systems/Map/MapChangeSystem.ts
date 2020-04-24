import { System, Entity, Not } from "ecsy";
import TileMap from "@client/components/TileMap";
import LocalPlayer from "@client/components/LocalPlayer";
import ChangeMap from "@client/components/ChangeMap";
import { Unloadable, Loadable } from "@client/components/Loadable";
import { mapAssetPath } from "../../utilities/assets";
import Movement from "@client/components/Movement";

export default class MapChangeSystem extends System {
  static queries = {
    tileMap: { components: [TileMap, Not(Unloadable), Not(Loadable)] },
    localPlayer: { components: [LocalPlayer, ChangeMap, Movement] },
  };

  execute() {
    //@ts-ignore
    this.queries.localPlayer.results.forEach((entity) => {
      const movement = entity.getComponent(Movement);
      if (movement.tileQueue.length || movement.direction) return;
      const changeMap = entity.getComponent(ChangeMap);
      //@ts-ignore
      this.queries.tileMap.results.forEach((entity) => {
        entity.addComponent(Unloadable, {
          dataPath: mapAssetPath(changeMap.nextMap),
        });
      });
    });
  }
}
