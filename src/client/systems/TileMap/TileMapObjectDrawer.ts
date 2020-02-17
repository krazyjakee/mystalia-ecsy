import { System, Not, Entity } from "ecsy";
import { Loadable } from "../../components/Loadable";
import Drawable from "../../components/Drawable";
import TileMap from "../../components/TileMap";
import { drawableToDrawableProperties } from "../../utilities/drawing";
import Movement from "../../components/Movement";
import { DrawableProperties } from "types/drawable";

export default class TileMapObjectDrawer extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), Drawable, Movement]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const objectLayerDrawables: DrawableProperties[] = [];

      // @ts-ignore
      this.queries.player.results.forEach((playerEntity: Entity) => {
        const playerDrawable = playerEntity.getComponent(Drawable);
        objectLayerDrawables.push(drawableToDrawableProperties(playerDrawable));
      });

      const tileMapComponent = tileMapEntity.getComponent(TileMap);
      tileMapComponent.objectLayerDrawables = objectLayerDrawables;
    });
  }
}
