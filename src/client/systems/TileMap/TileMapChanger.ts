import { System, Entity, Not } from "ecsy";
import { Unloadable, Loadable } from "../../components/Loadable";
import Fade from "../../components/Fade";
import TileMap from "../../components/TileMap";
import { fadeOverlay } from "../../utilities/drawing";
import loadTileMap, {
  getMapChangePosition
} from "../../utilities/TileMap/loadTileMap";
import Drawable from "../../components/Drawable";
import Movement from "../../components/Movement";
import { LocalPlayer, Remove } from "../../components/Tags";
import {
  tileIdToVector,
  setOffset
} from "../../utilities/TileMap/calculations";
import Position from "../../components/Position";
import NetworkRoom from "../../components/NetworkRoom";
import RemotePlayer from "../../components/RemotePlayer";

export default class TileMapChanger extends System {
  static queries = {
    player: {
      components: [LocalPlayer, Movement, Position]
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
    },
    networkRoom: {
      components: [NetworkRoom]
    },
    remotePlayers: {
      components: [RemotePlayer]
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
            const movement = playerEntity.getComponent(Movement);
            const playerPosition = playerEntity.getComponent(Position);

            const tileId = getMapChangePosition(
              movement,
              drawable.data.width,
              drawable.data.height,
              tileMap.objectTileStore
            );

            tileMap.reset();
            drawable.reset();
            await loadTileMap(loadable.dataPath, drawable, tileMap);

            const tileVector = tileIdToVector(tileId, drawable.data.width);
            playerPosition.value = tileVector;
            movement.currentTile = tileId;

            const centeredVector = {
              x: tileVector.x - Math.round(window.innerWidth / 2),
              y: tileVector.y - Math.round(window.innerHeight / 2)
            };

            const mapOffset = setOffset(
              centeredVector.x,
              centeredVector.y,
              { x: 0, y: 0 },
              tileMap.width,
              tileMap.height
            );

            drawable.offset = mapOffset;
            tileMap.targetTile = tileId;
          } else {
            await loadTileMap(loadable.dataPath, drawable, tileMap);
          }

          // @ts-ignore
          this.queries.networkRoom.results.forEach(
            (networkRoom: NetworkRoom) => {
              networkRoom.room?.leave();
              networkRoom.room = undefined;
            }
          );

          // @ts-ignore
          this.queries.remotePlayers.results.forEach((remotePlayer: Entity) => {
            remotePlayer.addComponent(Remove);
          });

          // Everything is good to go!
          loadable.loading = false;
          tileMapEntity.addComponent(Fade, { alpha: 0 });
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
