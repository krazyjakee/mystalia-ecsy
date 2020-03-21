import world from "../world";
import Drawable from "../components/Drawable";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import User from "types/User";

export default function CreateTileMap(user: User) {
  world
    .createEntity()
    .addComponent(Loadable, {
      dataPath: `/assets/maps/${user.metadata.room}.json`
    })
    .addComponent(Drawable)
    .addComponent(TileMap);
}
