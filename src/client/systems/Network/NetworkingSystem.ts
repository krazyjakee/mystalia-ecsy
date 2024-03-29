import { System, Entity, Not } from "ecsy";
import client from "../../colyseus";
import {
  SendData,
  AwaitingPosition,
  Remove,
  Gray,
  Disable,
  BattleTarget,
  PlayerDeath,
} from "@client/components/Tags";
import NewMovementTarget from "@client/components/NewMovementTarget";
import Movement from "@client/components/Movement";
import CreateRemotePlayer from "../../entities/RemotePlayer";
import NetworkRoom, { RoomState } from "@client/components/NetworkRoom";
import RemotePlayer from "@client/components/RemotePlayer";
import TileMap from "@client/components/TileMap";
import { Loadable, Unloadable } from "@client/components/Loadable";
import Position from "@client/components/Position";
import addOffset from "../../utilities/Vector/addOffset";
import compassToVector from "../../utilities/Compass/compassToVector";
import LocalPlayer from "@client/components/LocalPlayer";
import gameState from "../../gameState";
import CreateItem from "../../entities/Item";
import {
  tileIdToVector,
  vectorToTileId,
  vectorToPixels,
} from "utilities/tileMap";
import { RoomMessage } from "types/gameState";
import Item from "@client/components/Item";
import { isPresent } from "utilities/guards";
import CreateEnemy from "../../entities/Enemy";
import enemySpecs from "utilities/data/enemies.json";
import { EnemySpec } from "types/enemies";
import Weather from "@client/components/Weather";
import { ItemSpec } from "types/TileMap/ItemTiles";
import Enemy from "@client/components/Enemy";
import CreateEffect from "@client/entities/Effect";
import { UpdateLoot } from "@client/components/Loot";
import LootState from "@server/components/loot";
import lootItemStateToArray from "@client/react/Panels/Loot/lootItemStateToArray";
import { mapAssetPath } from "@client/utilities/assets";
import CreateLocalPlayer from "@client/entities/LocalPlayer";

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
    enemies: {
      components: [Enemy],
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
    const { fileName, width } = tileMap;

    const networkRoomEntity = this.queries.networkRoom.results[0] as Entity;

    const networkRoom = networkRoomEntity.getMutableComponent(NetworkRoom);

    if (networkRoom.joining) return;

    if (!networkRoom.room) {
      networkRoom.joining = true;
      client.joinOrCreate(fileName).then((room) => {
        tileMapEntity.removeComponent(Gray);
        clearTimeout(connectionTimer);
        gameState.addRoom("map", room);
        gameState.trigger("localPlayer:currentMap:response", {
          mapName: fileName,
        });

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

          enemy.onChange = function (changes) {
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

          enemy.onRemove = () => {
            this.queries.enemies.results.forEach((enemyEntity) => {
              const enemy = enemyEntity.getComponent(Enemy);
              const positionComponent = enemyEntity.getComponent(Position);
              const position = vectorToPixels(positionComponent.value);

              if (enemy.key === key) {
                CreateEffect({
                  position,
                  effectId: 1,
                  destinationSize: {
                    width: 32,
                    height: 32,
                  },
                });
                enemyEntity.addComponent(Remove);
              }
            });
          };
        };

        networkRoom.room.state.players.onAdd = (player, key) => {
          if (myKey !== key) {
            const newRemotePlayer = CreateRemotePlayer({ state: player, key });

            player.onChange = function (changes) {
              changes.forEach((change) => {
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
            player.onChange = function (changes) {
              changes.forEach((change) => {
                if (change.field === "inventory") {
                  gameState.trigger(
                    "localPlayer:inventory:response",
                    change.value
                  );
                }
              });
              gameState.trigger("localPlayer:change", {
                key: player.dbId,
                playerState: player,
              });
            };
          }
        };

        networkRoom.room.state.players.onRemove = (_, key) => {
          if (myKey !== key) {
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
          } else {
            const localPlayer = this.queries.localEntities.results[0];
            if (!localPlayer) return;

            localPlayer.addComponent(PlayerDeath);
          }
        };

        networkRoom.room.state.items.onAdd = (item) => {
          if (isPresent(item.itemId)) {
            const itemSpec = items.find((i) => i.id === item.itemId);
            if (itemSpec) {
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

        networkRoom.room.state.loot.onAdd = (loot) => {
          loot.onChange = function (changes) {
            const updates = changes
              .filter((change) => change.field === "items")
              .map((change) => ({
                tileId: loot.tileId,
                items: lootItemStateToArray(change.value),
              }));

            if (networkRoomEntity.hasComponent(UpdateLoot)) {
              const updateLoot = networkRoomEntity.getComponent(UpdateLoot);
              updateLoot.updates = updateLoot.updates.concat(updates);
            } else {
              networkRoomEntity.addComponent(UpdateLoot, { updates });
            }

            gameState.trigger("localPlayer:loot:update", {
              tileId: loot.tileId,
              lootState: loot,
            });
          };

          const sendUpdate = ({ tileId }) => {
            gameState.trigger("localPlayer:loot:update", {
              tileId: loot.tileId,
              lootState: loot,
            });
          };

          gameState.subscribe(
            "localPlayer:loot:request",
            sendUpdate,
            loot.tileId.toString()
          );

          loot.onRemove = () => {
            networkRoomEntity.addComponent(UpdateLoot, {
              updates: [
                {
                  tileId: loot.tileId,
                  items: [],
                },
              ],
            });

            gameState.trigger("localPlayer:loot:update", {
              tileId: loot.tileId,
              lootState: new LootState(loot.lootId, loot.tileId, []),
            });

            gameState.unsubscribe(
              "localPlayer:loot:request",
              sendUpdate,
              loot.tileId.toString()
            );
          };
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
          gameState.unsubscribe("localPlayer:loot:request");
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
