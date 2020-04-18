import { Loadable, SimpleLoadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import Position from "@client/components/Position";
import { getWorld } from "../ecsy";
import { characterAssetPath } from "../utilities/assets";
import { Vector } from "types/TMJ";
import { Size } from "types/TileMap/standard";

type BaseCharacterProps = {
  currentTile?: number;
  currentPosition?: Vector;
  spriteId?: string;
  speed?: number;
  size?: Size;
};

export default function BaseCharacter({
  currentTile,
  currentPosition = { x: 0, y: 0 },
  spriteId = "1",
  speed = 8,
  size,
}: BaseCharacterProps = {}) {
  const { width, height } = size || { width: 24, height: 32 };
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
      y: 32 - height,
    })
    .addComponent(Movement, { currentTile, speed })
    .addComponent(Position, { value: currentPosition });
}
