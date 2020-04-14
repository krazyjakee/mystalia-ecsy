import BaseCharacter from "./BaseCharacter";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";
import { generateAnimationSteps } from "../utilities/Animation/character";
import Enemy from "../components/Enemy";
import { EnemySpec } from "types/enemies";
import EnemyState from "serverState/enemy";
import { AwaitingPosition } from "../components/Tags";
import { tileIdToVector } from "utilities/tileMap";

export default function CreateEnemy(
  enemy: EnemyState,
  enemySpec: EnemySpec,
  mapWidth: number
) {
  const size = {
    width: 32,
    height: 32
  };

  return BaseCharacter({
    currentTile: enemy.currentTile,
    currentPosition: tileIdToVector(enemy.currentTile, mapWidth),
    spriteId: enemySpec.spritesheet,
    speed: enemySpec.speed,
    size
  })
    .addComponent(SpriteSheetAnimation, {
      speed: enemySpec.speed,
      steps: generateAnimationSteps("s", size)
    })
    .addComponent(Enemy, enemy);
}
