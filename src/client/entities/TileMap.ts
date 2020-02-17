import world from "../world";
import { Loadable } from "../components/Loadable";
import Drawable from "../components/Drawable";
import TileMap from "../components/TileMap";

world
  .createEntity()
  .addComponent(Loadable, { dataPath: "/assets/maps/first.json" })
  .addComponent(Drawable)
  .addComponent(TileMap);
