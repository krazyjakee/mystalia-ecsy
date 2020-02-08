import { System, Entity, Not } from "ecsy";
import Drawable from "../components/Drawable";
import KeyboardInput from "../components/KeyboardInput";
import TileMap from "../components/TileMap";
import { drawableToDrawableProperties } from "../utilities/drawing";
import PlayerComponent from "../components/Player";
import Loadable from "../components/Loadable";

export default class Player extends System {
  static queries = {
    player: {
      components: [Not(Loadable), PlayerComponent, Drawable, KeyboardInput]
    }
  };

  execute() {}
}
