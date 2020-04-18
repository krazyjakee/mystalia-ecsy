import { System, Entity } from "ecsy";
import Drawable from "@client/components/Drawable";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";

export default class AnimationSystem extends System {
  static queries = {
    animated: {
      components: [Drawable, SpriteSheetAnimation],
    },
  };

  execute(delta: number) {
    this.queries.animated.results.forEach(async (resource: Entity) => {
      const animation = resource.getComponent(SpriteSheetAnimation);
      const drawable = resource.getComponent(Drawable);

      if (!animation.steps.length) {
        return;
      }

      if (!animation.playing) {
        animation.step = animation.restingStep;
      } else if (animation.timeSinceLastAnimation > 800 / animation.speed) {
        if (animation.increment) {
          animation.step += 1;

          if (animation.step >= animation.steps.length - 1) {
            animation.step = animation.steps.length - 1;
            animation.increment = false;
          }
        } else {
          animation.step -= 1;

          if (animation.step <= 0) {
            animation.step = 0;
            animation.increment = true;
          }
        }

        animation.timeSinceLastAnimation = 0;
      } else {
        animation.timeSinceLastAnimation += delta;
      }

      const { x, y } = animation.steps[animation.step];
      drawable.sourceX = x;
      drawable.sourceY = y;
    });
  }
}
