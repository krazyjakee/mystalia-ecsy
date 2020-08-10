import { System, Not } from "ecsy";
import LocalPlayer from "@client/components/LocalPlayer";
import { BattleTarget, PlayerDeath } from "@client/components/Tags";
import client from "@client/colyseus";
import CreateLocalPlayer from "@client/entities/LocalPlayer";
import TileMap from "@client/components/TileMap";
import { Loadable, Unloadable } from "@client/components/Loadable";
import { mapAssetPath } from "@client/utilities/assets";
import CreateEffect from "@client/entities/Effect";
import Position from "@client/components/Position";
import gameState from "@client/gameState";

export default class DeathSystem extends System {
  static queries = {
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    localPlayer: {
      components: [LocalPlayer, PlayerDeath],
    },
    enemies: {
      components: [BattleTarget],
    },
  };

  execute() {
    const tileMapEntity =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;

    this.queries.localPlayer.results.forEach((localPlayer) => {
      const position = localPlayer.getComponent(Position);

      this.queries.enemies.results.forEach((enemyEntity) =>
        enemyEntity.removeComponent(BattleTarget)
      );

      gameState.trigger("localPlayer:battle:unTarget", undefined);

      CreateEffect({
        position: position.value,
        effectId: 1,
        destinationSize: {
          width: 32,
          height: 32,
        },
      });

      localPlayer.remove();

      setTimeout(() => {
        client.auth.logout();
        client.auth.login().then((user) => {
          CreateLocalPlayer(user);
          tileMapEntity.addComponent(Unloadable, {
            dataPath: mapAssetPath(user.metadata.room),
          });
        });
      }, 3000);
    });
  }
}
