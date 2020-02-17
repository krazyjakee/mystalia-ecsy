import { System, Entity, World } from "ecsy";
import client from "../colyseus";
import { SendData, Remove } from "../components/Tags";
import Movement from "../components/Movement";
import CreateRemotePlayer from "../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "../components/NetworkRoom";
import RemotePlayer from "../components/RemotePlayer";

export default class Networking extends System {
  static queries = {
    networkRoom: {
      components: [NetworkRoom]
    },
    localEntities: {
      components: [SendData, Movement]
    },
    remoteEntities: {
      components: [RemotePlayer]
    }
  };

  execute() {
    // @ts-ignore
    const networkRoom = this.queries.networkRoom.results[0] as NetworkRoom;

    if (networkRoom.joining) return;

    if (!networkRoom.room) {
      networkRoom.joining = true;
      client.joinOrCreate("first").then(room => {
        networkRoom.room = room as RoomState;
        networkRoom.joining = false;
        const myKey = room.sessionId;

        networkRoom.room.state.players.onAdd = (player, key) => {
          if (myKey !== key) {
            CreateRemotePlayer({ state: player, key });
          }
        };

        networkRoom.room.state.players.onRemove = (_, key) => {
          if (myKey !== key) {
            //@ts-ignore
            this.queries.remoteEntities.results.forEach(
              (remotePlayerEntity: Entity) => {
                const remotePlayerComponent = remotePlayerEntity.getComponent(
                  RemotePlayer
                );
                if (remotePlayerComponent.key === key) {
                  remotePlayerEntity.addComponent(Remove);
                }
              }
            );
          }
        };
      });
    }

    // @ts-ignore
    this.queries.localEntities.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.targetTile >= 0) {
        networkRoom.room?.send({
          command: "move",
          targetTile: movement.targetTile
        });
      }
      entityToSend.removeComponent(SendData);
    });
  }
}
