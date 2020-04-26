import Drawable from "@client/components/Drawable";
import TileMap from "@client/components/TileMap";
import { Loadable } from "@client/components/Loadable";
import AnimatedTile from "@client/components/AnimatedTile";
import User from "types/User";
import { getWorld } from "../ecsy";
import { mapAssetPath } from "../utilities/assets";
import Weather from "@client/components/Weather";
import Shop from "@client/components/Shop";

export default function CreateTileMap(user: User) {
  getWorld()
    .createEntity()
    .addComponent(Loadable, {
      dataPath: mapAssetPath(user.metadata.room),
    })
    .addComponent(Drawable)
    .addComponent(AnimatedTile)
    .addComponent(Weather)
    .addComponent(TileMap)
    .addComponent(Shop);
}
