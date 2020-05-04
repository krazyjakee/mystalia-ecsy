import BaseCharacter from "./BaseCharacter";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "../utilities/Animation/character";
import Enemy from "@client/components/Enemy";
import { EnemySpec } from "types/enemies";
import EnemyState from "@server/components/enemy";
import { tileIdToVector } from "utilities/tileMap";
import { MouseInput } from "@client/components/Tags";
import { CommandsPending } from "@client/components/LocalPlayer";

export default function CreateEnemy(
  key: string,
  enemy: EnemyState,
  enemySpec: EnemySpec,
  mapWidth: number
) {
  const size = {
    width: 32,
    height: 32,
  };

  return BaseCharacter({
    currentTile: enemy.currentTile,
    currentPosition: tileIdToVector(enemy.currentTile, mapWidth),
    spriteId: enemySpec.spritesheet,
    speed: enemySpec.speed,
    size,
  })
    .addComponent(SpriteSheetAnimation, {
      speed: enemySpec.speed,
      steps: generateCharacterAnimationSteps("s", size),
    })
    .addComponent(Enemy, { key, state: enemy })
    .addComponent(MouseInput)
    .addComponent(CommandsPending);
}
