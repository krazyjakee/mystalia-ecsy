import { System, Not } from "ecsy";
import Drawable from "@client/components/Drawable";
import Enemy from "@client/components/Enemy";
import gameState from "@client/gameState";
import enemyData from "utilities/data/enemies.json";
import { Vector } from "types/TMJ";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import { Focused } from "@client/components/Tags";
import Position from "@client/components/Position";
import addOffset from "@client/utilities/Vector/addOffset";
import CharacterHighlight, {
  AddCharacterHighlight,
  RemoveCharacterHighlight,
} from "@client/components/CharacterHighlight";

const positionEnemyState = (position: Vector, offset: Vector) => {
  const elem = document.getElementById(`enemyStateComponent`);
  if (elem) {
    const { x, y } = position;
    const offsetPosition = addOffset({ x: x * 32, y: y * 32 }, offset);
    elem.style.left = `${offsetPosition.x + 32}px`;
    elem.style.top = `${offsetPosition.y - 16}px`;
  }
};

export default class EnemyStatusSystem extends System {
  static queries = {
    focusedEnemies: {
      components: [Focused, Drawable, Enemy],
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
    const tileMapDrawable = tileMap.getComponent(Drawable);
    const { offset } = tileMapDrawable;

    // @ts-ignore
    this.queries.focusedEnemies.added.forEach((enemyEntity) => {
      const enemy = enemyEntity.getComponent(Enemy);
      const position = enemyEntity.getComponent(Position);
      if (enemy.key) {
        gameState.trigger("enemy:focused", {
          key: enemy.key,
          enemySpec: enemyData.find((spec) =>
            enemy.state ? spec.id === enemy.state.enemyId : false
          ),
          enemyState: enemy.state,
        });

        positionEnemyState(position.value, offset);
        enemyEntity.addComponent(AddCharacterHighlight, { type: "focus" });
      }
    });

    // @ts-ignore
    this.queries.focusedEnemies.removed.forEach((enemyEntity) => {
      const enemy = enemyEntity.getComponent(Enemy);
      if (enemy.key) {
        gameState.trigger("enemy:unfocused", {
          key: enemy.key,
        });
      }
      enemyEntity.addComponent(RemoveCharacterHighlight, { type: "focus" });
    });

    this.queries.focusedEnemies.results.forEach((enemyEntity) => {
      const position = enemyEntity.getComponent(Position);
      positionEnemyState(position.value, offset);
    });
  }
}
