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
      components: [Not(Loadable), PlayerComponent, Drawable, KeyboardInput],
      listen: {
        added: true,
        removed: true
      }
    },
    tileMap: {
      components: [TileMap]
    }
  };

  execute() {
    // @ts-ignore
    const tileMapEntity = this.queries.tileMap.results[0] as Entity;
    const tileMap = tileMapEntity.getComponent(TileMap);

    // @ts-ignore
    this.queries.player.added.forEach((playerEntity: Entity) => {
      const playerDrawable = playerEntity.getComponent(Drawable);

      tileMap.objectLayerDrawables.push({
        name: "player",
        ...drawableToDrawableProperties(playerDrawable)
      });
    });

    // @ts-ignore
    this.queries.player.removed.forEach((playerEntity: Entity) => {
      const index = tileMap.objectLayerDrawables.findIndex(
        drawable => drawable.name === "player"
      );
      tileMap.objectLayerDrawables.splice(index, 1);
    });
  }
}
