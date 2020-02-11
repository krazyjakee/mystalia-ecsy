import world from "../world";
import { Loadable, SimpleLoadable } from "../components/Loadable";
import Drawable from "../components/Drawable";
import Player from "../components/Player";
import KeyboardInput from "../components/KeyboardInput";
import MouseInput from "../components/MouseInput";

world
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
  .addComponent(KeyboardInput)
  .addComponent(MouseInput)
  .addComponent(Player);
