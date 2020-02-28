import { System, Entity } from "ecsy";
import Drawable from "../components/Drawable";
import SpriteSheetAnimation from "../components/SpriteSheetAnimation";

export default class Animation extends System {
  static queries = {
    animated: {
      components: [Drawable, SpriteSheetAnimation]
    }
  };

  execute(delta: number) {
    // @ts-ignore
    this.queries.animated.results.forEach(async (resource: Entity) => {
      const animation = resource.getComponent(SpriteSheetAnimation);
      const drawable = resource.getComponent(Drawable);

      if (!animation.steps.length) {
        return;
      }

      if (!animation.playing) {
        animation.step = animation.restingStep;
      } else if (animation.timeSinceLastAnimation > 1000 / animation.speed) {
        animation.step += 1;

        if (animation.step === animation.steps.length) {
          animation.step = 0;
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
