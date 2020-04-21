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
import {
  drawImage,
  drawableToDrawableProperties,
  createShadowCanvas,
  drawableWithOffset,
} from "@client/utilities/drawing";
import { vectorToPixels } from "utilities/tileMap";
import context2d from "@client/canvas";

const [shadowCanvas, shadowContext] = createShadowCanvas();
shadowCanvas.width = 32;
shadowCanvas.height = 32;

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
    });

    this.queries.focusedEnemies.results.forEach((enemyEntity) => {
      const position = enemyEntity.getComponent(Position);
      const drawable = enemyEntity.getComponent(Drawable);
      positionEnemyState(position.value, offset);

      const drawableProperties = drawableToDrawableProperties(drawable);

      const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];

      shadowContext.clearRect(0, 0, 32, 32);

      const positionPixels = vectorToPixels(position.value);

      // draw images at offsets from the array scaled by s
      for (let i = 0; i < dArr.length; i += 2) {
        drawImage(
          {
            ...drawableProperties,
            x: dArr[i],
            y: dArr[i + 1],
            offset: { x: 0, y: 0 },
          },
          shadowContext
        );
      }

      shadowContext.save();
      // fill with color
      shadowContext.globalCompositeOperation = "source-in";
      shadowContext.fillStyle = "rgba(255,0,0,0.8)";
      shadowContext.fillRect(0, 0, 32, 32);

      // draw original image in dest-out mode to keep only the outline
      shadowContext.globalCompositeOperation = "destination-out";

      drawImage(
        {
          ...drawableProperties,
          x: 0,
          y: 0,
          offset: { x: 0, y: 0 },
        },
        shadowContext
      );

      shadowContext.restore();

      drawImage(
        drawableWithOffset(
          {
            ...drawableProperties,
            image: shadowCanvas,
            sourceX: 0,
            sourceY: 0,
          },
          offset,
          positionPixels.x,
          positionPixels.y
        )
      );
    });
  }
}
