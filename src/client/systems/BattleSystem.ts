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
import {
  AddCharacterHighlight,
  RemoveCharacterHighlight,
} from "@client/components/CharacterHighlight";
import { EnemySpec } from "types/enemies";
import aStar from "utilities/movement/aStar";
import Position from "@client/components/Position";
import { vectorToTileId } from "utilities/tileMap";

const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

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
        gameState.trigger("localPlayer:battle:targetEnemy", {
          key: enemy.key,
          enemySpec: enemySpecs.find((e) => e.id === enemy.state?.enemyId),
          enemyState: enemy.state,
        });
      }
      enemyEntity.addComponent(AddCharacterHighlight, { type: "battle" });
    });

    this.queries.targettedEnemies.removed?.forEach((enemyEntity) => {
      gameState.send("map", "localPlayer:battle:unTarget", undefined);
      gameState.trigger("localPlayer:battle:unTarget", undefined);
      if (!(enemyEntity as any)._world) return;
      enemyEntity.addComponent(RemoveCharacterHighlight, { type: "battle" });
    });

    this.queries.targettedEnemies.results.forEach((enemyEntity) => {
      const playerMovement = localPlayerEntity.getComponent(Movement);
      const playerPosition = localPlayerEntity.getComponent(Position);
      const enemyPosition = enemyEntity.getComponent(Position);

      const currentTile = vectorToTileId(playerPosition.value, tileMap.width);
      const enemyTile = vectorToTileId(enemyPosition.value, tileMap.width);

      if (!playerMovement.tileQueue.length) {
        const path = aStar.findPath(
          tileMap.fileName,
          currentTile,
          enemyTile,
          tileMap.width
        );

        if (!path) {
          enemyEntity.removeComponent(BattleTarget);
          return;
        }

        const { inventory } = localPlayerEntity.getComponent(Inventory);

        const equippedItem = inventory.find((item) => item && item.equipped);

        let weaponRange = 1;
        if (equippedItem && equippedItem.type === "cast") {
          weaponRange = equippedItem.range || 1;
        }

        const currentRange = distanceBetweenTiles(
          currentTile,
          enemyTile,
          tileMap.width
        );

        if (currentRange > weaponRange && tileMap.objectTileStore) {
          const path = findClosestPath(
            tileMap.objectTileStore,
            currentTile,
            enemyTile,
            weaponRange > 1 ? weaponRange - 1 : 1
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
