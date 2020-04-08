import { System, Entity, Not } from "ecsy";
import client from "../../colyseus";
import { SendData, AwaitingPosition, Remove } from "../../components/Tags";
import NewMovementTarget from "../../components/NewMovementTarget";
import Movement from "../../components/Movement";
import CreateRemotePlayer from "../../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "../../components/NetworkRoom";
import RemotePlayer from "../../components/RemotePlayer";
import TileMap from "../../components/TileMap";
import { Loadable } from "../../components/Loadable";
import Position from "../../components/Position";
import addOffset from "../../utilities/Vector/addOffset";
import compassToVector from "../../utilities/Compass/compassToVector";
import LocalPlayer from "../../components/LocalPlayer";
import gameState from "../../gameState";
import CreateItem from "../../entities/Item";
import { tileIdToVector, vectorToTileId } from "utilities/tileMap";
import { RoomMessage } from "types/gameState";
import items from "../../data/items.json";
import Item from "../../components/Item";
import { isPresent } from "utilities/guards";
import { StaticQuery } from "types/ecsy";

let connectionTimer: any;

export default class NetworkingSystem extends System {
  static queries: StaticQuery = {
    networkRoom: {
      components: [NetworkRoom],
    },
    localEntitiesToSend: {
      components: [SendData, Movement, LocalPlayer],
    },
    remoteEntities: {
      components: [RemotePlayer],
    },
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    localEntities: {
      components: [LocalPlayer, Movement],
    },
    loadedItems: {
      components: [Not(Loadable), Item],
    },
  };

  execute() {
    const tileMapEntity =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;
    const tileMap = (tileMapEntity as Entity).getComponent(TileMap);
    const { name, width } = tileMap;

    const networkRoomEntity = this.queries.networkRoom.results[0] as Entity;

    const networkRoom = networkRoomEntity.getMutableComponent(NetworkRoom);

    if (networkRoom.joining) return;

    if (!networkRoom.room) {
      networkRoom.joining = true;
      client.joinOrCreate(name).then((room) => {
        clearTimeout(connectionTimer);
        gameState.addRoom("map", room);
        networkRoom.room = room as RoomState;
        networkRoom.joining = false;
        const myKey = room.sessionId;

        this.queries.localEntities.results.forEach((localEntity: Entity) => {
          const movement = localEntity.getComponent(Movement);
          if (movement.currentTile >= 0) {
            networkRoom.room?.send({
              command: "move",
              targetTile: movement.currentTile,
            });
          }
        });

        networkRoom.room.state.players.onAdd = (player, key) => {
          if (myKey !== key) {
            const newRemotePlayer = CreateRemotePlayer({ state: player, key });

            player.onChange = function(changes) {
              changes.forEach((change) => {
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
                      targetTile: player.targetTile,
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
                targetTile: player.targetTile,
              });
              position.value = tileIdToVector(player.targetTile, width);
            } else {
              newRemotePlayer.addComponent(AwaitingPosition);
            }
          } else {
            gameState.trigger(
              "localPlayer:inventory:response",
              player.inventory
            );
            player.onChange = function(changes) {
              changes.forEach((change) => {
                if (change.field === "inventory") {
                  gameState.trigger(
                    "localPlayer:inventory:response",
                    player.inventory
                  );
                }
              });
            };
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

        networkRoom.room.state.items.onAdd = (item) => {
          if (isPresent(item.itemId)) {
            const itemSpec = items.find((i) => i.id === item.itemId);
            if (itemSpec) {
              //@ts-ignore
              const exists = this.queries.loadedItems.results.find(
                (itemEntity: Entity) => {
                  const itemComponent = itemEntity.getComponent(Item);
                  return (
                    itemComponent.itemId === item.itemId &&
                    item.tileId === itemComponent.tileId
                  );
                }
              );
              if (!exists) {
                CreateItem(item, itemSpec);
              }
            }
          }
        };

        networkRoom.room.state.items.onRemove = (item, key) => {
          if (isPresent(item.itemId)) {
            //@ts-ignore
            this.queries.loadedItems.results.forEach((itemEntity: Entity) => {
              const itemComponent = itemEntity.getComponent(Item);
              if (
                itemComponent.itemId === item.itemId &&
                item.tileId === itemComponent.tileId
              ) {
                itemEntity.addComponent(Remove);
              }
            });
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

    this.queries.localEntitiesToSend.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.direction) {
        const packet: RoomMessage<"localPlayer:movement:report"> = {
          command: "localPlayer:movement:report",
          targetTile: vectorToTileId(
            addOffset(
              tileIdToVector(movement.currentTile, width),
              compassToVector(movement.direction)
            ),
            width
          ),
        };

        networkRoom.room?.send(packet);
      }
      entityToSend.removeComponent(SendData);
    });
  }
}
