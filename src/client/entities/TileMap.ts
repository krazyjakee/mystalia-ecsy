import world from "../world";
import { Loadable } from "../components/Loadable";
import { Drawable } from "../components/Drawable";

world
  .createEntity()
  .addComponent(Loadable, { dataPath: "/assets/maps/first.json" })
  .addComponent(Drawable);
