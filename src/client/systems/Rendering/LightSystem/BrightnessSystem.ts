import { System } from "ecsy";
import EnvironmentBrightness from "@client/components/EnvironmentBrightness";
import { calculateBrightness } from "./lightRenderFunctions";

export default class BrightnessSystem extends System {
  static queries = {
    brightness: {
      components: [EnvironmentBrightness],
      listen: {
        added: true,
      },
    },
  };

  execute() {
    this.queries.brightness.added?.forEach((brightnessEntity) => {
      const brightnessComponent = brightnessEntity.getMutableComponent(
        EnvironmentBrightness
      );
      brightnessComponent.brightness = calculateBrightness();
    });

    this.queries.brightness.results.forEach((brightnessEntity) => {
      const brightnessComponent = brightnessEntity.getMutableComponent(
        EnvironmentBrightness
      );
      const { brightness, offset } = brightnessComponent;
      const targetBrightness = calculateBrightness() + offset;

      if (brightness > targetBrightness) {
        brightnessComponent.brightness -= 0.1;
      } else if (brightness < targetBrightness) {
        brightnessComponent.brightness += 0.1;
      }
    });
  }
}
