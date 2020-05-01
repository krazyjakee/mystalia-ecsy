import { System, Not, Entity } from "ecsy";
import LocalPlayer from "@client/components/LocalPlayer";
import Enemy from "@client/components/Enemy";
import gameState from "@client/gameState";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import Movement from "@client/components/Movement";
import { isPresent } from "utilities/guards";
import Inventory from "@client/components/Inventory";
import NewMovementTarget from "@client/components/NewMovementTarget";
import {
  findClosestPath,
  distanceBetweenTiles,
} from "utilities/movement/surroundings";
import { BattleTarget } from "@client/components/Tags";
import Position from "@client/components/Position";
import { vectorToTileId } from "utilities/tileMap";

export default class BattleSystem extends System {
  static queries = {
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    targettedEnemies: {
      components: [BattleTarget, Not(LocalPlayer)],
      listen: {
        added: true,
        removed: true,
      },
    },
    targetedLocalPlayer: {
      components: [LocalPlayer, BattleTarget],
    },
    localPlayer: {
      components: [LocalPlayer],
    },
  };

  execute() {
    const tileMapEntity =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMapEntity) return;
    const tileMap = (tileMapEntity as Entity).getComponent(TileMap);

    const localPlayerEntity =
      this.queries.localPlayer.results.length &&
      this.queries.localPlayer.results[0];
    if (!localPlayerEntity) return;

    this.queries.targettedEnemies.added?.forEach((enemyEntity) => {
      const enemy = enemyEntity.getComponent(Enemy);
      if (enemy.key) {
        gameState.send("map", "localPlayer:battle:targetEnemy", {
          key: enemy.key,
        });
      }
    });

    this.queries.targettedEnemies.removed?.forEach(() => {
      gameState.send("map", "localPlayer:battle:unTarget", undefined);
    });

    this.queries.targettedEnemies.results.forEach((enemyEntity) => {
      const playerMovement = localPlayerEntity.getComponent(Movement);

      // TODO: Check if the enemy tile is accessable by the player and return if not.

      if (!playerMovement.tileQueue.length) {
        const movement = enemyEntity.getComponent(Movement);
        const { inventory } = localPlayerEntity.getComponent(Inventory);

        const equippedItem = inventory.find((item) => item.equipped);

        let weaponRange = 1;
        if (equippedItem && equippedItem.class === "cast") {
          // TODO: Change the range
        }

        const currentRange = distanceBetweenTiles(
          playerMovement.currentTile,
          movement.currentTile,
          tileMap.width
        );

        if (currentRange > weaponRange) {
          const path = findClosestPath(
            tileMap.objectTileStore,
            playerMovement.currentTile,
            movement.currentTile,
            weaponRange
          );

          const lastTile = path?.pop();
          if (isPresent(lastTile)) {
            localPlayerEntity.addComponent(NewMovementTarget, {
              targetTile: lastTile,
            });
          }
        }
      }
    });
  }
}
