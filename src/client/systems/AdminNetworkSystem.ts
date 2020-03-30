import { System, Entity, Not } from "ecsy";
import client from "../colyseus";
import { Loadable } from "../components/Loadable";
import LocalPlayer, { RoleCheckPending } from "../components/LocalPlayer";

export default class AdminNetworkSystem extends System {
  static queries = {
    localPlayer: {
      components: [Not(Loadable), RoleCheckPending, LocalPlayer]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.localPlayer.results.forEach((localPlayerEntity: Entity) => {
      const localPlayer = localPlayerEntity.getComponent(LocalPlayer);
      if (localPlayer.user) {
        const role = localPlayer.user.metadata.role;
        if (role && role > 0) {
          client.joinOrCreate("admin").then(room => {
            document.dispatchEvent(new Event("admin:enable"));
            room.onLeave(() => {
              console.log("Admin access denied");
              document.dispatchEvent(new Event("admin:disable"));
            });
          });
        }
      }
      localPlayerEntity.removeComponent(RoleCheckPending);
    });
  }
}
