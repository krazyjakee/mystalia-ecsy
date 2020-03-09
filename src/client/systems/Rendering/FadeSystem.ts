import { System, Entity, Not } from "ecsy";
import Fade from "../../components/Fade";
import { fadeOverlay } from "../../utilities/drawing";
import { Loadable, Unloadable } from "../../components/Loadable";
import TileMap from "../../components/TileMap";

export default class FadeSystem extends System {
  static queries = {
    loadingTileMaps: {
      components: [Loadable, TileMap, Fade]
    },
    newUnloadingTileMaps: {
      components: [TileMap, Unloadable, Not(Fade)],
      listen: {
        added: true
      }
    },
    unloadingTileMaps: {
      components: [TileMap, Unloadable, Fade]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadingTileMaps.results.forEach(
      async (tileMapEntity: Entity) => {
        const fade = tileMapEntity.getComponent(Fade);

        fadeOverlay(fade);
        if (fade.alpha > 1) {
          tileMapEntity.removeComponent(Loadable);
          tileMapEntity.removeComponent(Fade);
        }
      }
    );

    // @ts-ignore
    this.queries.newUnloadingTileMaps.added.forEach((tileMapEntity: Entity) => {
      tileMapEntity.addComponent(Fade);
    });

    // @ts-ignore
    this.queries.unloadingTileMaps.results.forEach((tileMapEntity: Entity) => {
      const fade = tileMapEntity.getComponent(Fade);

      fadeOverlay(fade, false);
      if (fade.alpha <= 0) {
        const unloadable = tileMapEntity.getComponent(Unloadable);
        tileMapEntity.addComponent(Loadable, {
          dataPath: unloadable.dataPath
        });
        tileMapEntity.removeComponent(Unloadable);
        tileMapEntity.removeComponent(Fade);
      }
    });
  }
}
