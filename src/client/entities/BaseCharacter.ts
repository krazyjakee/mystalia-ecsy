import world from "../world";
import { Loadable, SimpleLoadable } from "../components/Loadable";
import Drawable from "../components/Drawable";
import Movement from "../components/Movement";
import Position from "../components/Position";

export default function BaseCharacter(currentTile?: number) {
  return world
    .createEntity()
    .addComponent(SimpleLoadable)
    .addComponent(Loadable, { imagePath: "/assets/characters/1.png" })
    .addComponent(Drawable, {
      width: 24,
      height: 32,
      sourceWidth: 24,
      sourceHeight: 32,
      x: 4
    })
    .addComponent(Movement, { currentTile })
    .addComponent(Position);
}
