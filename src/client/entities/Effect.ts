import { getWorld } from "../ecsy";
import Drawable from "@client/components/Drawable";
import SpriteSheetAnimation from "@client/components/SpriteSheetAnimation";
import { SimpleLoadable, Loadable } from "@client/components/Loadable";
import Position from "@client/components/Position";
import { effectAssetPath } from "@client/utilities/assets";
import { Vector } from "types/TMJ";
import { Size } from "types/TileMap/standard";
import { Effect } from "@client/components/Tags";

type CreateEffectProps = {
  imageName: string;
  position: Vector;
  effectId: number;
  destinationSize: Size;
};

export default function CreateEffect({
  imageName,
  position,
  effectId,
  destinationSize,
}: CreateEffectProps) {
  const { width, height } = destinationSize;

  // TODO: Read effect source Size from effects.json

  getWorld()
    .createEntity()
    .addComponent(Effect)
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: effectAssetPath(imageName) })
    .addComponent(Drawable, {
      width,
      height,
      sourceWidth: width,
      sourceHeight: height,
    })
    .addComponent(SpriteSheetAnimation, {
      speed: 5,
    })
    .addComponent(Position, { value: position })
    .addComponent(GenerateSpriteSheetAnimationSteps, { size }); // TODO: Create a SpriteSheetAnimation system to generate steps for SpriteSheetAnimation after loading the image.
}

// TODO: Create effect system to render effects
