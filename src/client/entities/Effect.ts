import { getWorld } from "../ecsy";
import Drawable from "@client/components/Drawable";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";
import Position from "@client/components/Position";
import { effectAssetPath } from "@client/utilities/assets";
import { Vector } from "types/TMJ";
import { Size } from "types/TileMap/standard";
import { GenerateSpriteSheetAnimationSteps } from "@client/components/Tags";
import Effect from "@client/components/Effect";
import { EffectSpec } from "utilities/effect";

const effects = require("utilities/data/effects") as EffectSpec[];

type CreateEffectProps = {
  position: Vector;
  effectId: number;
  destinationSize: Size;
};

export default function CreateEffect({
  position,
  effectId,
  destinationSize,
}: CreateEffectProps) {
  const { width, height } = destinationSize;

  const effectSpec = effects.find((e) => e.id === effectId);

  if (!effectSpec) return;

  getWorld()
    .createEntity()
    .addComponent(Effect, { effectId })
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, {
      imagePath: effectAssetPath(effectSpec.spritesheet),
    })
    .addComponent(Drawable, {
      width,
      height,
      sourceWidth: width,
      sourceHeight: height,
    })
    .addComponent(SpriteSheetAnimation, {
      speed: effectSpec.speed || 6,
    })
    .addComponent(Position, { value: position })
    .addComponent(GenerateSpriteSheetAnimationSteps);
}
