import { System, Entity, Not } from "ecsy";
import client from "../colyseus";
import { SendData, Remove, LocalPlayer } from "../components/Tags";
import Movement from "../components/Movement";
import CreateRemotePlayer from "../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "../components/NetworkRoom";
import RemotePlayer from "../components/RemotePlayer";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import Position from "../components/Position";
import {
  tileIdToVector,
  vectorToTileId,
  addOffset,
  compassToVector
} from "../utilities/TileMap/calculations";

export default class Networking extends System {
  static queries = {
    networkRoom: {
      components: [NetworkRoom]
    },
    localEntitiesToSend: {
      components: [SendData, Movement, LocalPlayer]
    },
    remoteEntities: {
      components: [RemotePlayer, Not(Remove)]
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)]
    },
    localEntities: {
      components: [LocalPlayer, Movement]
    },
    expiredRemotePlayers: {
      components: [RemotePlayer, Remove]
    }
  };

  execute() {
    const tileMapEntity =
      // @ts-ignore
      this.queries.tileMaps.results.length &&
      // @ts-ignore
      this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;
    const tileMap = (tileMapEntity as Entity).getComponent(TileMap);
    const { name, width } = tileMap;

    // @ts-ignore
    const networkRoom = this.queries.networkRoom.results[0] as NetworkRoom;

    if (networkRoom.joining) return;

    if (!networkRoom.room) {
      networkRoom.joining = true;
      client.joinOrCreate(name).then(room => {
        networkRoom.room = room as RoomState;
        networkRoom.joining = false;
        const myKey = room.sessionId;

        // @ts-ignore
        this.queries.localEntities.results.forEach((localEntity: Entity) => {
          const movement = localEntity.getComponent(Movement);
          if (movement.currentTile >= 0) {
            networkRoom.room?.send({
              command: "move",
              targetTile: movement.currentTile
            });
          }
        });

        networkRoom.room.state.players.onAdd = (player, key) => {
          if (myKey !== key) {
            const newRemotePlayer = CreateRemotePlayer({ state: player, key });
            player.onChange = function(changes) {
              changes.forEach(change => {
                const newMovement = newRemotePlayer.getComponent(Movement);
                const newPosition = newRemotePlayer.getComponent(Position);
                if (change.field === "targetTile") {
                  newMovement.targetTile = change.value;
                  if (newMovement.targetTile !== undefined) {
                    const targetVector = tileIdToVector(
                      newMovement.targetTile,
                      width
                    );
                    if (
                      Math.abs(targetVector.x - newPosition.value.x) >= 5 ||
                      Math.abs(targetVector.y - newPosition.value.y) >= 5
                    ) {
                      // if the new position is too far from the current one we should teleport
                      newMovement.currentTile = newMovement.targetTile;
                      newPosition.value = tileIdToVector(
                        newMovement.targetTile,
                        width
                      );
                    }
                  }
                }
              });
            };
            if (player.targetTile) {
              const position = newRemotePlayer.getMutableComponent(Position);
              const movement = newRemotePlayer.getMutableComponent(Movement);
              movement.currentTile = player.targetTile;
              movement.targetTile = player.targetTile;
              position.value = tileIdToVector(player.targetTile, width);
            }
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
    this.queries.localEntitiesToSend.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.direction) {
        networkRoom.room?.send({
          command: "move",
          targetTile: vectorToTileId(
            addOffset(
              tileIdToVector(movement.currentTile, width),
              compassToVector(movement.direction)
            ),
            width
          )
        });
      }
      entityToSend.removeComponent(SendData);
    });

    // @ts-ignore
    this.queries.expiredRemotePlayers.results.forEach(
      (remotePlayer: Entity) => {
        remotePlayer.remove();
      }
    );
  }
}
