import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import Enemy from "@client/components/Enemy";
import gameState from "@client/gameState";
import enemyData from "utilities/data/enemies.json";
import { Vector } from "types/TMJ";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import { MouseIsOver } from "@client/components/MouseIs";

const positionEnemyState = (position: Vector) => {
  const elem = document.getElementById(`enemyStateComponent`);
  if (elem) {
    elem.style.left = `${position.x + 1}px`;
    elem.style.top = `${position.y + 1}px`;
  }
};

export default class EnemyHoverSystem extends System {
  static queries = {
    hoveredEnemies: {
      components: [MouseIsOver, Drawable, Enemy],
      listen: {
        added: true,
        removed: true,
      },
    },
    tileMaps: {
      components: [TileMap, Not(Loadable), Drawable],
    },
  };

  execute() {
    const tileMap =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMap) return;

    // @ts-ignore
    this.queries.hoveredEnemies.added.forEach((enemyEntity) => {
      const { position } = enemyEntity.getComponent(MouseIsOver);
      const enemy = enemyEntity.getComponent(Enemy);
      if (enemy.key && position) {
        gameState.trigger("enemy:hovered", {
          key: enemy.key,
          enemySpec: enemyData.find((spec) =>
            enemy.state ? spec.id === enemy.state.enemyId : false
          ),
          enemyState: enemy.state,
        });

        positionEnemyState({ x: position.x, y: position.y });
      }
    });

    // @ts-ignore
    this.queries.hoveredEnemies.removed.forEach((enemyEntity) => {
      const enemy = enemyEntity.getComponent(Enemy);
      if (enemy.key) {
        gameState.trigger("enemy:unhovered", {
          key: enemy.key,
        });
      }
    });

    this.queries.hoveredEnemies.results.forEach((enemyEntity) => {
      const { position } = enemyEntity.getComponent(MouseIsOver);
      if (position) {
        positionEnemyState({ x: position.x, y: position.y });
      }
    });
  }
}
