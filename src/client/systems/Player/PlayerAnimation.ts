import { System, Entity, Not } from "ecsy";
import Movement from "../../components/Movement";
import { Loadable } from "../../components/Loadable";
import SpriteSheetAnimation from "../../components/SpriteSheetAnimation";
import { generateAnimationSteps } from "../../utilities/Animation/character";

export default class PlayerAnimation extends System {
  static queries = {
    player: {
      components: [Not(Loadable), Movement, SpriteSheetAnimation]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.player.results.forEach((playerEntity: Entity) => {
      const movement = playerEntity.getComponent(Movement);
      const animation = playerEntity.getComponent(SpriteSheetAnimation);

      const { direction } = movement;

      if (!direction) {
        animation.playing = false;
      } else {
        animation.playing = true;
        animation.steps = generateAnimationSteps(direction);
      }
    });
  }
}
