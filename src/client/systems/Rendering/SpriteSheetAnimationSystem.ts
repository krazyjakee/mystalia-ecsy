import { System, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import Position from "@client/components/Position";
import {
  GenerateSpriteSheetAnimationSteps,
  Remove,
} from "@client/components/Tags";
import Drawable from "@client/components/Drawable";
import { EffectSpec } from "utilities/effect";
import Effect from "@client/components/Effect";
import { generateAnimationSteps } from "@client/utilities/Animation/general";
import {
  drawImage,
  drawableWithOffset,
  drawableToDrawableProperties,
} from "@client/utilities/drawing";
import TileMap from "@client/components/TileMap";

const effects = require("utilities/data/effects") as EffectSpec[];

export default class SpriteSheetAnimationSystem extends System {
  static queries = {
    tileMaps: {
      components: [TileMap, Not(Loadable)],
    },
    readySpritesheets: {
      components: [Effect, SpriteSheetAnimation, Position, Not(Loadable)],
    },
    unReadySpritesheets: {
      components: [Effect, GenerateSpriteSheetAnimationSteps, Not(Loadable)],
    },
  };

  execute() {
    const tileMap =
      this.queries.tileMaps.results.length && this.queries.tileMaps.results[0];
    if (!tileMap) return;
    const tileMapDrawable = tileMap.getComponent(Drawable);
    const { offset } = tileMapDrawable;

    this.queries.unReadySpritesheets.results.forEach((entity) => {
      const effect = entity.getComponent(Effect);
      const drawable = entity.getComponent(Drawable);
      const spriteSheetAnimation = entity.getMutableComponent(
        SpriteSheetAnimation
      );

      if (drawable.image) {
        const effectSpec = effects.find((e) => e.id === effect.effectId);
        if (effectSpec) {
          spriteSheetAnimation.steps = generateAnimationSteps(
            { width: effectSpec.frameWidth, height: effectSpec.frameHeight },
            {
              width: drawable.image.width as number,
              height: drawable.image.height as number,
            },
            effectSpec.frames
          );
          entity.removeComponent(GenerateSpriteSheetAnimationSteps);
          return;
        }
      }
      entity.addComponent(Remove);
    });

    this.queries.readySpritesheets.results.forEach((entity) => {
      const effect = entity.getComponent(Effect);
      const drawable = entity.getComponent(Drawable);
      const { value } = entity.getComponent(Position);
      const spriteSheetAnimation = entity.getMutableComponent(
        SpriteSheetAnimation
      );

      if (
        drawable.image &&
        spriteSheetAnimation.step < spriteSheetAnimation.steps.length
      ) {
        const effectSpec = effects.find((e) => e.id === effect.effectId);
        if (effectSpec) {
          const drawableProperties = drawableToDrawableProperties(drawable);

          drawImage(
            drawableWithOffset(drawableProperties, offset, value.x, value.y)
          );
          return;
        }
      }
      entity.addComponent(Remove);
    });
  }
}
