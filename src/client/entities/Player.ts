import world from "../world";
import Loadable from "../components/Loadable";
import Drawable from "../components/Drawable";
import Player from "../components/Player";
import KeyboardInput from "../components/KeyboardInput";

world
  .createEntity()
  .addComponent(Loadable, { imagePath: "/assets/characters/1.png" })
  .addComponent(Drawable)
  .addComponent(KeyboardInput)
  .addComponent(Player);
