import { Loadable, SimpleLoadable } from "../components/Loadable";
import Drawable from "../components/Drawable";
import Movement from "../components/Movement";
import Position from "../components/Position";
import { getWorld } from "../ecsy";
import { characterAssetPath } from "../utilities/assets";

export default function BaseCharacter(
  currentTile?: number,
  spriteId: string = "1",
  speed: number = 8,
  { width, height }: { width: number; height: number } = {
    width: 24,
    height: 32
  }
) {
  return getWorld()
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: characterAssetPath(spriteId) })
    .addComponent(Drawable, {
      width,
      height,
      sourceWidth: width,
      sourceHeight: height,
      x: 32 - width,
      y: 32 - height
    })
    .addComponent(Movement, { currentTile, speed })
    .addComponent(Position);
}
