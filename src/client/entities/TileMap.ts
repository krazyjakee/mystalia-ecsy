import Drawable from "../components/Drawable";
import TileMap from "../components/TileMap";
import { Loadable } from "../components/Loadable";
import AnimatedTile from "../components/AnimatedTile";
import User from "types/User";
import { getWorld } from "../ecsy";
import { mapAssetPath } from "../utilities/assets";
import Weather from "../components/Weather";

export default function CreateTileMap(user: User) {
  getWorld()
    .createEntity()
    .addComponent(Loadable, {
      dataPath: mapAssetPath(user.metadata.room),
    })
    .addComponent(Drawable)
    .addComponent(AnimatedTile)
    .addComponent(Weather)
    .addComponent(TileMap);
}
