import { System, Entity, Not } from "ecsy";
import { Loadable } from "../../../components/Loadable";
import Fade from "../../../components/Fade";
import TileMap from "../../../components/TileMap";
import loadTileMap from "./loadTileMap";
import getMapChangePosition from "./getMapChangePosition";
import Drawable from "../../../components/Drawable";
import Movement from "../../../components/Movement";
import setOffset from "../../../utilities/Vector/setOffset";
import Position from "../../../components/Position";
import NetworkRoom from "../../../components/NetworkRoom";
import RemotePlayer from "../../../components/RemotePlayer";
import LocalPlayer from "../../../components/LocalPlayer";
import AnimatedTile, {
  AnimatedTilesInitiated,
} from "../../../components/AnimatedTile";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";
import ChangeMap from "../../../components/ChangeMap";
import Item from "../../../components/Item";
import { Remove } from "../../../components/Tags";

export default class TileMapChanger extends System {
  static queries = {
    player: {
      components: [LocalPlayer, Movement, Position],
    },
    newLoadingTileMaps: {
      components: [Loadable, TileMap, Drawable, AnimatedTile, Not(Fade)],
    },
    networkRoom: {
      components: [NetworkRoom],
    },
    remotePlayers: {
      components: [RemotePlayer],
    },
    items: {
      components: [Item],
    },
  };

  execute() {
    let playerEntity: Entity;

    //@ts-ignore
    this.queries.player.results.forEach((entity) => {
      playerEntity = entity;
    });

    this.queries.newLoadingTileMaps.results.forEach(
      async (tileMapEntity: Entity) => {
        const loadable = tileMapEntity.getComponent(Loadable);
        if (loadable.loading) {
          return;
        }

        loadable.loading = true;

        const drawable = tileMapEntity.getComponent(Drawable);
        const tileMap = tileMapEntity.getMutableComponent(TileMap);

        if (loadable.dataPath) {
          loadable.loading = true;
          const movement = playerEntity.getMutableComponent(Movement);
          const playerPosition = playerEntity.getMutableComponent(Position);
          let tileId = movement.currentTile;

          // Do we have data from a previous map?
          const changeMap = playerEntity.getComponent(ChangeMap);
          if (drawable.data) {
            tileId = getMapChangePosition(
              changeMap?.direction,
              movement.currentTile,
              drawable.data.width,
              drawable.data.height,
              tileMap.objectTileStore
            );
            playerEntity.removeComponent(ChangeMap);
          }

          tileMap.reset();
          drawable.reset();

          await loadTileMap(loadable.dataPath, drawable, tileMap);

          const tilePixels = tileIdToPixels(tileId, drawable.data.width);
          const tileVector = tileIdToVector(tileId, drawable.data.width);
          playerPosition.value = tileVector;
          movement.currentTile = tileId;

          const mapSmallerThanWindow =
            drawable.width <= window.innerWidth &&
            drawable.height <= window.innerHeight;

          if (mapSmallerThanWindow) {
            drawable.offset = {
              x:
                Math.round(window.innerWidth / 2) -
                Math.round(drawable.width / 2),
              y:
                Math.round(window.innerHeight / 2) -
                Math.round(drawable.height / 2),
            };
          } else {
            const centeredVector = {
              x: tilePixels.x - Math.round(window.innerWidth / 2),
              y: tilePixels.y - Math.round(window.innerHeight / 2),
            };

            drawable.offset = setOffset(
              centeredVector.x,
              centeredVector.y,
              { x: 0, y: 0 },
              drawable.width,
              drawable.height
            );
          }

          tileMap.targetTile = tileId;

          this.queries.networkRoom.results.forEach(
            (networkRoomEntity: Entity) => {
              const networkRoom = networkRoomEntity.getMutableComponent(
                NetworkRoom
              );
              networkRoom.room?.leave();
              networkRoom.room = undefined;
            }
          );

          //@ts-ignore
          this.queries.remotePlayers.results.forEach((remotePlayer: Entity) => {
            remotePlayer.addComponent(Remove);
          });

          //@ts-ignore
          this.queries.items.results.forEach((item: Entity) => {
            item.addComponent(Remove);
          });

          // Everything is good to go!
          loadable.loading = false;
          tileMapEntity.addComponent(Fade, { alpha: 0 });
          tileMapEntity.removeComponent(AnimatedTilesInitiated);
        }
      }
    );
  }
}
