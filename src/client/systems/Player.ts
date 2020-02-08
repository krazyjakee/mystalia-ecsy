import { System, Entity, Not } from "ecsy";
import Loadable from "../components/Loadable";
import Drawable from "../components/Drawable";
import KeyboardInput from "../components/KeyboardInput";
import TileMap from "../components/TileMap";

export default class Player extends System {
  static queries = {
    player: {
      components: [Not(Loadable), Player, Drawable, KeyboardInput]
    },
    tileMap: {
      component: [Not(Loadable), TileMap]
    }
  };

  execute() {
    // @ts-ignore
    const tileMapEntity = this.queries.tileMap.results[0] as Entity;
    const tileMap = tileMapEntity.getComponent(TileMap);

    // @ts-ignore
    const playerEntity = this.queries.player.results[0] as Entity;

    // TODO: Inject the player sprite into the tilemap object layer
  }
}
