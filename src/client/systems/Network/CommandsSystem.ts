import { System, Not, Entity } from "ecsy";
import { Loadable, Unloadable } from "@client/components/Loadable";
import LocalPlayer, {
  RoleCheckPending,
  CommandsPending,
} from "@client/components/LocalPlayer";
import gameState from "../../gameState";
import TileMap from "@client/components/TileMap";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import { mapAssetPath } from "../../utilities/assets";

export default class CommandsSystem extends System {
  static queries = {
    localPlayer: {
      components: [LocalPlayer, CommandsPending],
    },
    tileMap: {
      components: [TileMap],
    },
  };

  execute() {
    this.queries.tileMap.results.forEach((tileMapEntity) => {
      this.queries.localPlayer.results.forEach((localPlayerEntity: Entity) => {
        const drawable = tileMapEntity.getMutableComponent(Drawable);
        const movement = localPlayerEntity.getMutableComponent(Movement);

        gameState.subscribe("admin:teleport:response", ({ map, tileId }) => {
          drawable.data = undefined;
          movement.currentTile = tileId;
          movement.tileQueue = [];
          movement.direction = undefined;
          tileMapEntity.addComponent(Unloadable, {
            dataPath: mapAssetPath(map),
          });
        });

        gameState.subscribe("localPlayer:movement:request", () => {
          gameState.trigger("localPlayer:movement:response", {
            currentTile: movement.currentTile,
          });
        });

        localPlayerEntity.removeComponent(CommandsPending);
      });
    });
  }
}
