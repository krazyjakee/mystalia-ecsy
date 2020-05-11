import MapRoom from "@server/rooms/map";
import PlayerState from "@server/components/player";
import EnemyState from "@server/components/enemy";
import inventoryStateToArray from "@client/react/Panels/Inventory/inventoryStateToArray";
import { distanceBetweenTiles } from "utilities/movement/surroundings";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { EnemySpec } from "types/enemies";
import { RoomMessage } from "types/gameState";
import { randomNumberBetween } from "utilities/math";
import { AbilitySpec } from "types/types";
import { isPresent } from "utilities/guards";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];
const abilitySpecs = require("utilities/data/abilities") as AbilitySpec[];

export default class Battle {
  room: MapRoom;
  timer: NodeJS.Timeout;

  constructor(room: MapRoom) {
    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    let targettingPlayers: string[] = [];
    for (let key in this.room.state.players) {
      const player = this.room.state.players[key] as PlayerState;
      if (player.targetEnemy) {
        targettingPlayers.push(key);
      }
    }

    let targettingEnemies: string[] = [];
    for (let key in this.room.state.enemies) {
      const enemy = this.room.state.enemies[key] as EnemyState;
      if (enemy.targetPlayer) {
        targettingEnemies.push(key);
      }
    }

    targettingPlayers.forEach((playerKey) => {
      const inventoryArray = inventoryStateToArray(
        this.room.state.players[playerKey].inventory
      );

      if (inventoryArray) {
        const equippedItems = inventoryArray.filter(
          (item) =>
            item.equipped && item.type && ["melee", "cast"].includes(item.type)
        );

        const enemyKey = (this.room.state.players[playerKey] as PlayerState)
          .targetEnemy;

        if (enemyKey && this.room.state.enemies[enemyKey]) {
          const enemyPosition = (this.room.state.enemies[
            enemyKey
          ] as EnemyState).currentTile;
          const playerPosition = (this.room.state.players[
            playerKey
          ] as PlayerState).targetTile;

          if (equippedItems.length) {
            equippedItems.forEach((item) => {
              const weaponRange = item.range || 1;

              if (
                enemyKey &&
                this.room.state.enemies[enemyKey] &&
                this.room.mapData
              ) {
                const enemyPosition = (this.room.state.enemies[
                  enemyKey
                ] as EnemyState).currentTile;
                const playerPosition = (this.room.state.players[
                  playerKey
                ] as PlayerState).targetTile;
                if (playerPosition) {
                  const distance = distanceBetweenTiles(
                    playerPosition,
                    enemyPosition,
                    this.room.mapData.width
                  );
                  if (distance <= weaponRange) {
                    this.damageEnemy(playerKey, enemyKey, item);
                  }
                }
              } else if (enemyKey && !this.room.state.enemies[enemyKey]) {
                (this.room.state.players[
                  playerKey
                ] as PlayerState).targetEnemy = undefined;
              }
            });
          } else {
            if (playerPosition && this.room.mapData) {
              const distance = distanceBetweenTiles(
                playerPosition,
                enemyPosition,
                this.room.mapData.width
              );
              if (distance <= 1) {
                this.damageEnemy(playerKey, enemyKey);
              }
            }
          }
        }
      }
    });

    targettingEnemies.forEach((key) => {
      const enemyState = this.room.state.enemies[key] as EnemyState;
      if (!enemyState || !enemyState.targetPlayer || !this.room.mapData) return;

      const enemySpec = enemySpecs.find((e) => e.id === enemyState.enemyId);

      if (!enemySpec) return;

      const abilities: AbilitySpec[] = enemySpec.abilities
        .map((a) => abilitySpecs.find((as) => as.id === a))
        .filter(isPresent);

      const playerPosition = (this.room.state.players[
        enemyState.targetPlayer
      ] as PlayerState).targetTile;

      if (!playerPosition) return;

      const enemyPosition = (this.room.state.enemies[key] as EnemyState)
        .currentTile;

      if (abilities && abilities.length) {
        const distance = distanceBetweenTiles(
          playerPosition,
          enemyPosition,
          this.room.mapData.width
        );
        abilities.forEach((ability) => {
          if (distance <= (ability.range || 1)) {
            if (enemyState.targetPlayer) {
              this.damagePlayer(enemyState.targetPlayer, key, ability);
            }
          }
        });
      }
    });
  }

  damageEnemy(playerKey: string, enemyKey: string, item?: InventoryItems) {
    const [from, to] = item?.damage || [1, 3];
    const inflicted = randomNumberBetween(to, from);
    (this.room.state.enemies[enemyKey] as EnemyState).damage += inflicted;
    const enemy = this.room.state.enemies[enemyKey] as EnemyState;
    if (!enemy.targetPlayer) {
      (this.room.state.enemies[
        enemyKey
      ] as EnemyState).targetPlayer = playerKey;
    }
    const enemySpec = enemySpecs.find((e) => e.id === enemy.enemyId);
    if (enemySpec) {
      this.room.broadcast("enemy:battle:damageTaken", {
        fromUsername: this.room.state.players[playerKey].username,
        enemyKey,
        damage: inflicted,
        itemId: item?.itemId,
      } as RoomMessage<"enemy:battle:damageTaken">);
      if (enemySpec.hp - enemy.damage <= 0) {
        this.room.enemySpawner?.destroy(enemyKey);
      }
    }
  }

  damagePlayer(playerKey: string, enemyKey: string, ability: AbilitySpec) {
    const [from, to] = ability.damage || [1, 3];
    const inflicted = randomNumberBetween(to, from);
    (this.room.state.players[playerKey] as PlayerState).damage += inflicted;
    const player = this.room.state.players[playerKey] as PlayerState;
    const damageTakenMessage = {
      fromEnemyKey: enemyKey,
      playerUsername: player.username,
      damage: inflicted,
      ability: ability.id,
    } as RoomMessage<"remotePlayer:battle:damageTaken">;

    const client = this.room.clients.find((c) => c.sessionId === playerKey);
    if (player && client) {
      this.room.broadcast(
        "remotePlayer:battle:damageTaken",
        damageTakenMessage,
        {
          except: client,
        }
      );
      this.room.send(
        client,
        "localPlayer:battle:damageTaken",
        damageTakenMessage
      );
      if (player.damage >= 100) {
        // TODO: Kill player
      }
    }
  }

  dispose() {
    clearInterval(this.timer);
  }
}
