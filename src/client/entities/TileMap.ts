import Drawable from "../components/Drawable";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import AnimatedTile from "../components/AnimatedTile";
import User from "types/User";
import { getWorld } from "../ecsy";

export default function CreateTileMap(user: User) {
  getWorld()
    .createEntity()
    .addComponent(Loadable, {
      dataPath: `/assets/maps/${user.metadata.room}.json`
    })
    .addComponent(Drawable)
    .addComponent(AnimatedTile)
    .addComponent(TileMap);
}
