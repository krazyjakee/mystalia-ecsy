import { System, Entity, Not } from "ecsy";
import client from "../colyseus";
import { SendData, Remove, AwaitingPosition } from "../components/Tags";
import NewMovementTarget from "../components/NewMovementTarget";
import Movement from "../components/Movement";
import CreateRemotePlayer from "../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "../components/NetworkRoom";
import RemotePlayer from "../components/RemotePlayer";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import Position from "../components/Position";
import {
  tileIdToVector,
  vectorToTileId
} from "../utilities/TileMap/calculations";
import addOffset from "../utilities/Vector/addOffset";
import compassToVector from "../utilities/Compass/compassToVector";
import LocalPlayer from "../components/LocalPlayer";

let connectionTimer: any;

export default class NetworkingSystem extends System {
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
    const networkRoomEntity = this.queries.networkRoom.results[0] as Entity;

    const networkRoom = networkRoomEntity.getMutableComponent(NetworkRoom);

    if (networkRoom.joining) return;

    if (!networkRoom.room) {
      networkRoom.joining = true;
      client.joinOrCreate(name).then(room => {
        clearTimeout(connectionTimer);
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
                // const newPosition = newRemotePlayer.getComponent(Position);
                if (change.field === "targetTile") {
                  const movement = newRemotePlayer.getComponent(Movement);
                  const awaitingPosition = newRemotePlayer.hasComponent(
                    AwaitingPosition
                  );
                  if (!awaitingPosition) movement.tileQueue.push(change.value);
                  else if (player.targetTile !== undefined) {
                    const position = newRemotePlayer.getMutableComponent(
                      Position
                    );
                    movement.currentTile = player.targetTile;
                    newRemotePlayer.addComponent(NewMovementTarget, {
                      targetTile: player.targetTile
                    });
                    position.value = tileIdToVector(player.targetTile, width);
                    newRemotePlayer.removeComponent(AwaitingPosition);
                  }
                }
              });
            };
            if (player.targetTile !== undefined) {
              const position = newRemotePlayer.getMutableComponent(Position);
              const movement = newRemotePlayer.getMutableComponent(Movement);
              movement.currentTile = player.targetTile;
              newRemotePlayer.addComponent(NewMovementTarget, {
                targetTile: player.targetTile
              });
              position.value = tileIdToVector(player.targetTile, width);
            } else {
              newRemotePlayer.addComponent(AwaitingPosition);
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

        networkRoom.room.onLeave(() => {
          connectionTimer = setTimeout(() => {
            (window as any).ecsyError = true;
            document.dispatchEvent(new Event("ws:close"));
            alert("Server connection timed out");
          }, 5000);
        });
      });
    }

    // @ts-ignore
    this.queries.localEntitiesToSend.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.direction) {
        const packet = {
          command: "move",
          targetTile: vectorToTileId(
            addOffset(
              tileIdToVector(movement.currentTile, width),
              compassToVector(movement.direction)
            ),
            width
          )
        };

        networkRoom.room?.send(packet);
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
