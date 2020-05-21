import { System, Not } from "ecsy";
import LocalPlayer from "@client/components/LocalPlayer";
import Movement from "@client/components/Movement";
import gameState from "@client/gameState";
import { ChangeMap, ChangingMap } from "@client/components/TileMap";

export default class MapChangeSystem extends System {
  static queries = {
    localPlayer: {
      components: [LocalPlayer, ChangeMap, Movement, Not(ChangingMap)],
    },
  };

  execute() {
    //@ts-ignore
    this.queries.localPlayer.results.forEach((entity) => {
      const movement = entity.getComponent(Movement);
      const { direction } = entity.getComponent(ChangeMap);
      if (movement.tileQueue.length || movement.direction) return;
      if (direction) {
        entity.addComponent(ChangingMap);
        gameState.send("map", "localPlayer:movement:walkOff", {
          direction,
        });
      }
      entity.removeComponent(ChangeMap);
    });
  }
}
