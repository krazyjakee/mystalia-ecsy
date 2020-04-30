import { System, Entity, Not } from "ecsy";
import client from "../../colyseus";
import {
  SendData,
  AwaitingPosition,
  Remove,
  Gray,
  Disable,
} from "@client/components/Tags";
import NewMovementTarget from "@client/components/NewMovementTarget";
import Movement from "@client/components/Movement";
import CreateRemotePlayer from "../../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "@client/components/NetworkRoom";
import RemotePlayer from "@client/components/RemotePlayer";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Position from "@client/components/Position";
import addOffset from "../../utilities/Vector/addOffset";
import compassToVector from "../../utilities/Compass/compassToVector";
import LocalPlayer from "@client/components/LocalPlayer";
import gameState from "../../gameState";
import CreateItem from "../../entities/Item";
import { tileIdToVector, vectorToTileId } from "utilities/tileMap";
import { RoomMessage } from "types/gameState";
import Item from "@client/components/Item";
import { isPresent } from "utilities/guards";
import CreateEnemy from "../../entities/Enemy";
import enemySpecs from "utilities/data/enemies.json";
import { EnemySpec } from "types/enemies";
import Weather from "@client/components/Weather";
import { ItemSpec } from "types/TileMap/ItemTiles";

const items = require("utilities/data/items.json") as ItemSpec[];

let connectionTimer: any;

export default class NetworkingSystem extends System {
  static queries = {
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
        tileMapEntity.removeComponent(Gray);
        clearTimeout(connectionTimer);
        gameState.addRoom("map", room);
        networkRoom.room = room as RoomState;
        networkRoom.joining = false;
        const myKey = room.sessionId;

        this.queries.localEntities.results.forEach((localEntity: Entity) => {
          const movement = localEntity.getComponent(Movement);
          if (movement.currentTile >= 0) {
            networkRoom.room?.send("localPlayer:movement:report", {
              targetTile: movement.currentTile,
            });
          }
        });

        networkRoom.room.state.enemies.onAdd = (enemy, key) => {
          const enemySpec = (enemySpecs as EnemySpec[]).find(
            (spec) => spec.id === enemy.enemyId
          );
          if (!enemySpec) {
            return;
          }

          const newEnemy = CreateEnemy(key, enemy, enemySpec, tileMap.width);

          gameState.trigger("enemy:change", {
            key,
            enemyState: enemy,
            enemySpec,
          });

          enemy.onChange = function(changes) {
            changes.forEach((change) => {
              if (change.field === "currentTile") {
                const movement = newEnemy.getComponent(Movement);
                const awaitingPosition = newEnemy.hasComponent(
                  AwaitingPosition
                );
                if (!awaitingPosition) movement.tileQueue.push(change.value);
                else if (enemy.currentTile !== undefined) {
                  const position = newEnemy.getMutableComponent(Position);
                  movement.currentTile = enemy.currentTile;
                  newEnemy.addComponent(NewMovementTarget, {
                    targetTile: enemy.currentTile,
                  });
                  position.value = tileIdToVector(enemy.currentTile, width);
                  newEnemy.removeComponent(AwaitingPosition);
                }
              }
              gameState.trigger("enemy:change", {
                key,
                enemyState: enemy,
                enemySpec,
              });
            });
          };
        };

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

        networkRoom.room.state.weather.onAdd = (weatherState) => {
          const weather = tileMapEntity.getMutableComponent(Weather);
          if (weather) {
            weather.active = weatherState.weathers;
            weatherState.onChange = (changes) => {
              changes.forEach((change) => {
                if (change.field === "weathers") {
                  weather.active = change.value;
                }
              });
            };
          }
        };

        networkRoom.room.onLeave(() => {
          connectionTimer = setTimeout(() => {
            this.queries.localEntities.results.forEach(
              (localEntity: Entity) => {
                localEntity.addComponent(Disable);
              }
            );
            tileMapEntity.addComponent(Gray);
          }, 5000);
        });
      });
    }

    this.queries.localEntitiesToSend.results.forEach((entityToSend: Entity) => {
      const movement = entityToSend.getComponent(Movement);
      if (movement.direction) {
        const packet: RoomMessage<"localPlayer:movement:report"> = {
          targetTile: vectorToTileId(
            addOffset(
              tileIdToVector(movement.currentTile, width),
              compassToVector(movement.direction)
            ),
            width
          ),
        };

        networkRoom.room?.send("localPlayer:movement:report", packet);
      }
      entityToSend.removeComponent(SendData);
    });
  }
}
