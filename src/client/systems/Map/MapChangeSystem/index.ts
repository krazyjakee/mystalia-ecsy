import { System, Entity, Not } from "ecsy";
import { Loadable } from "../../../components/Loadable";
import Fade from "../../../components/Fade";
import TileMap from "../../../components/TileMap";
import loadTileMap from "./loadTileMap";
import getMapChangePosition from "./getMapChangePosition";
import Drawable from "../../../components/Drawable";
import Movement from "../../../components/Movement";
import { Remove } from "../../../components/Tags";
import {
  tileIdToVector,
  tileIdToPixels
} from "../../../utilities/TileMap/calculations";
import setOffset from "../../../utilities/Vector/setOffset";
import Position from "../../../components/Position";
import NetworkRoom from "../../../components/NetworkRoom";
import RemotePlayer from "../../../components/RemotePlayer";
import LocalPlayer from "../../../components/LocalPlayer";
import AnimatedTile, {
  AnimatedTilesInitiated
} from "../../../components/AnimatedTile";

export default class TileMapChanger extends System {
  static queries = {
    player: {
      components: [LocalPlayer, Movement, Position]
    },
    newLoadingTileMaps: {
      components: [Loadable, TileMap, Drawable, AnimatedTile, Not(Fade)]
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
        const tileMap = tileMapEntity.getMutableComponent(TileMap);
        const animatedTiles = tileMapEntity.getMutableComponent(AnimatedTile);

        if (loadable.dataPath) {
          loadable.loading = true;
          const movement = playerEntity.getMutableComponent(Movement);
          const playerPosition = playerEntity.getMutableComponent(Position);
          let tileId = movement.currentTile;

          // Do we have data from a previous map?
          if (drawable.data) {
            tileId = getMapChangePosition(
              movement,
              drawable.data.width,
              drawable.data.height,
              tileMap.objectTileStore
            );

            tileMap.reset();
            drawable.reset();
          }

          await loadTileMap(
            loadable.dataPath,
            drawable,
            tileMap,
            animatedTiles
          );

          const tilePixels = tileIdToPixels(tileId, drawable.data.width);
          const tileVector = tileIdToVector(tileId, drawable.data.width);
          playerPosition.value = tileVector;
          movement.currentTile = tileId;

          const centeredVector = {
            x: tilePixels.x - Math.round(window.innerWidth / 2),
            y: tilePixels.y - Math.round(window.innerHeight / 2)
          };

          const mapOffset = setOffset(
            centeredVector.x,
            centeredVector.y,
            { x: 0, y: 0 },
            drawable.width,
            drawable.height
          );

          drawable.offset = mapOffset;
          tileMap.targetTile = tileId;

          // @ts-ignore
          this.queries.networkRoom.results.forEach(
            (networkRoomEntity: Entity) => {
              const networkRoom = networkRoomEntity.getMutableComponent(
                NetworkRoom
              );
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
          tileMapEntity.removeComponent(AnimatedTilesInitiated);
        }
      }
    );
  }
}
