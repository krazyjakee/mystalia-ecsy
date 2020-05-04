import { System, Entity, Not } from "ecsy";
import Movement from "@client/components/Movement";
import { Loadable } from "@client/components/Loadable";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { generateCharacterAnimationSteps } from "../../utilities/Animation/character";
import Drawable from "@client/components/Drawable";

export default class PlayerAnimationSystem extends System {
  static queries = {
    player: {
      components: [Not(Loadable), Movement, SpriteSheetAnimation],
    },
  };

  execute() {
    this.queries.player.results.forEach((playerEntity: Entity) => {
      const movement = playerEntity.getComponent(Movement);
      const animation = playerEntity.getComponent(SpriteSheetAnimation);
      const drawable = playerEntity.getComponent(Drawable);

      const { direction } = movement;

      if (!direction) {
        animation.playing = false;
      } else {
        animation.playing = true;
        animation.steps = generateCharacterAnimationSteps(direction, {
          width: drawable.width,
          height: drawable.height,
        });
      }
    });
  }
}
