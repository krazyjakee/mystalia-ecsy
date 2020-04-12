import BaseCharacter from "./BaseCharacter";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";
import { generateAnimationSteps } from "../utilities/Animation/character";
import Enemy from "../components/Enemy";
import { EnemySpec } from "types/enemies";
import EnemyState from "serverState/enemy";
import { AwaitingPosition } from "../components/Tags";

export default function CreateEnemy(enemy: EnemyState, enemySpec: EnemySpec) {
  const size = {
    width: 32,
    height: 32
  };

  return BaseCharacter(
    enemy.currentTile,
    enemySpec.spritesheet,
    enemySpec.speed,
    size
  )
    .addComponent(SpriteSheetAnimation, {
      speed: enemySpec.speed,
      steps: generateAnimationSteps("s", size)
    })
    .addComponent(Enemy, enemy)
    .addComponent(AwaitingPosition);
}
