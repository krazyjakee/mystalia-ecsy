import MapRoom from "@server/rooms/map";
import PlayerState from "@server/components/player";
import EnemyState from "@server/components/enemy";
import inventoryStateToArray from "@client/react/Panels/Inventory/inventoryStateToArray";
import { distanceBetweenTiles } from "utilities/movement/surroundings";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { EnemySpec } from "types/enemies";
import { RoomMessage } from "types/gameState";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

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

        if (equippedItems.length) {
          equippedItems.forEach((item) => {
            const weaponRange = item.type === "melee" ? 1 : 1; // TODO: Add range to itemspec for cast class.
            const enemyKey = (this.room.state.players[playerKey] as PlayerState)
              .targetEnemy;
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
        }
      }
    });

    // TODO: Get enemy abilities
    // TODO: Detect if player is close enough to target to attack
    // TODO: Perform attacks
  }

  damageEnemy(playerKey: string, enemyKey: string, item: InventoryItems) {
    if (item.damage) {
      const [from, to] = item.damage;
      const inflicted = Math.floor(Math.random() * to) + from;
      (this.room.state.enemies[enemyKey] as EnemyState).damage += inflicted;
      const enemy = this.room.state.enemies[enemyKey] as EnemyState;
      const enemySpec = enemySpecs.find((e) => e.id === enemy.enemyId);
      if (enemySpec) {
        this.room.broadcast("enemy:battle:damageTaken", {
          fromUsername: this.room.state.players[playerKey].username,
          enemyKey,
          damage: inflicted,
          itemId: item.itemId,
        } as RoomMessage<"enemy:battle:damageTaken">);
        if (enemySpec.hp - enemy.damage <= 0) {
          this.room.enemySpawner?.destroy(enemyKey);
        }
      }
    }
  }

  dispose() {
    clearInterval(this.timer);
  }
}
