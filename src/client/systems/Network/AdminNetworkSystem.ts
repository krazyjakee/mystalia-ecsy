import { System, Entity, Not } from "ecsy";
import client from "../../colyseus";
import { Loadable } from "@client/components/Loadable";
import LocalPlayer, { RoleCheckPending } from "@client/components/LocalPlayer";
import gameState from "../../gameState";

export default class AdminNetworkSystem extends System {
  static queries = {
    localPlayer: {
      components: [Not(Loadable), RoleCheckPending, LocalPlayer],
    },
  };

  execute() {
    this.queries.localPlayer.results.forEach((localPlayerEntity: Entity) => {
      const localPlayer = localPlayerEntity.getComponent(LocalPlayer);
      if (localPlayer.user) {
        const role = localPlayer.user.metadata.role;
        if (role && role > 0) {
          client.joinOrCreate("admin").then((room) => {
            gameState.addRoom("admin", room);
            gameState.trigger("admin:enable", undefined);
            room.onLeave(() => {
              console.log("Admin access denied");
              gameState.trigger("admin:disable", undefined);
              gameState.removeRoom("admin");
            });
          });
        }
      }
      localPlayerEntity.removeComponent(RoleCheckPending);
    });
  }
}
