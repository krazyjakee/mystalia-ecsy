import { System, Entity, Not } from "ecsy";
import Movement from "../../components/Movement";
import { Loadable } from "../../components/Loadable";
import RemotePlayer from "../../components/RemotePlayer";
import { Remove } from "../../components/Tags";

export default class PlayerNetworkInput extends System {
  static queries = {
    remotePlayers: {
      components: [Not(Loadable), RemotePlayer]
    },
    expiredRemotePlayers: {
      components: [RemotePlayer, Remove]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.remotePlayers.results.forEach((remotePlayer: Entity) => {
      const remotePlayerComponent = remotePlayer.getComponent(RemotePlayer);
      const { state } = remotePlayerComponent;

      if (!state) return;
      if (state.onChange) return;

      state.onChange = function(changes) {
        changes.forEach(change => {
          const newPlayerMovementComponent = remotePlayer.getComponent(
            Movement
          );
          if (change.field === "targetTile") {
            newPlayerMovementComponent.targetTile = change.value;
          }
        });
      };
    });

    // @ts-ignore
    this.queries.expiredRemotePlayers.results.forEach(
      (remotePlayer: Entity) => {
        remotePlayer.remove();
      }
    );
  }
}
