import { System, Entity, Not } from "ecsy";
import { Unloadable, Loadable } from "../../components/Loadable";
import Fade from "../../components/Fade";
import TileMap from "../../components/TileMap";
import { fadeOverlay, waitForNextFrame } from "../../utilities/drawing";
import loadTileMap, {
  getMapChangePosition
} from "../../utilities/TileMap/loadTileMap";
import Drawable from "../../components/Drawable";
import Player from "../../components/Player";
import {
  tileIdToVector,
  setOffset
} from "../../utilities/TileMap/calculations";

export default class TileMapChanger extends System {
  static queries = {
    player: {
      components: [Player]
    },
    newLoadingTileMaps: {
      components: [Loadable, TileMap, Drawable, Not(Fade)]
    },
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
    let playerEntity: Entity;

    //@ts-ignore
    this.queries.player.results.forEach((entity: Entity) => {
      playerEntity = entity;
    });

    // @ts-ignore
    this.queries.newLoadingTileMaps.results.forEach(
      async (tileMapEntity: Entity) => {
        const loadable = tileMapEntity.getComponent(Loadable);
        if (loadable.loading) {
          return;
        }

        loadable.loading = true;

        const drawable = tileMapEntity.getComponent(Drawable);
        const tileMap = tileMapEntity.getComponent(TileMap);

        if (loadable.dataPath) {
          loadable.loading = true;
          // Do we have data from a previous map?
          if (drawable.data) {
            const playerComponent = playerEntity.getComponent(Player);
            const playerDrawable = playerEntity.getComponent(Drawable);
            const tileId = getMapChangePosition(
              playerComponent,
              drawable.data.width,
              drawable.data.height,
              tileMap.objectTileStore
            );

            tileMap.reset();
            drawable.reset();
            await loadTileMap(loadable.dataPath, drawable, tileMap);

            const tileVector = tileIdToVector(tileId, drawable.data.width);
            playerDrawable.x = tileVector.x;
            playerDrawable.y = tileVector.y;
            playerComponent.currentTile = tileId;

            const centeredVector = {
              x: tileVector.x - Math.round(window.innerWidth / 2),
              y: tileVector.y - Math.round(window.innerHeight / 2)
            };

            const mapOffset = setOffset(
              centeredVector.x,
              centeredVector.y,
              drawable.offset,
              tileMap.width,
              tileMap.height
            );
            drawable.offset = mapOffset;
          } else {
            await loadTileMap(loadable.dataPath, drawable, tileMap);
          }

          // Everything is good to go!
          loadable.loading = false;
          tileMapEntity.addComponent(Fade, { alpha: 0 });
          await waitForNextFrame();
        }
      }
    );

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
