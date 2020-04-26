import { System, Entity, Not } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import Fade from "@client/components/Fade";
import TileMap from "@client/components/TileMap";
import loadTileMap from "./loadTileMap";
import getMapChangePosition from "./getMapChangePosition";
import Drawable from "@client/components/Drawable";
import Movement from "@client/components/Movement";
import setOffset from "@client/utilities/Vector/setOffset";
import Position from "@client/components/Position";
import NetworkRoom from "@client/components/NetworkRoom";
import RemotePlayer from "@client/components/RemotePlayer";
import LocalPlayer from "@client/components/LocalPlayer";
import AnimatedTile, {
  AnimatedTilesInitiated,
} from "@client/components/AnimatedTile";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";
import ChangeMap from "@client/components/ChangeMap";
import Item from "@client/components/Item";
import { Remove } from "@client/components/Tags";
import Enemy from "@client/components/Enemy";
import Weather from "@client/components/Weather";
import config from "@client/config.json";
import Shop from "@client/components/Shop";

const { allowableOffMapDistance } = config;

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
    enemies: {
      components: [Enemy],
    },
    items: {
      components: [Item],
    },
  };

  execute() {
    let playerEntity: Entity;

    this.queries.player.results.forEach((entity) => {
      playerEntity = entity;
    });

    this.queries.newLoadingTileMaps.results.forEach(async (tileMapEntity) => {
      const loadable = tileMapEntity.getComponent(Loadable);
      if (loadable.loading) {
        return;
      }

      loadable.loading = true;

      const drawable = tileMapEntity.getMutableComponent(Drawable);
      const tileMap = tileMapEntity.getMutableComponent(TileMap);
      const weather = tileMapEntity.getMutableComponent(Weather);

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
        if (weather) {
          weather.reset();
        }

        await loadTileMap(loadable.dataPath, drawable, tileMap);

        const tilePixels = tileIdToPixels(tileId, drawable.data.width);
        const tileVector = tileIdToVector(tileId, drawable.data.width);
        playerPosition.value = tileVector;
        movement.currentTile = tileId;

        const windowWidth = window.innerWidth + allowableOffMapDistance * 2;
        const windowHeight = window.innerHeight + allowableOffMapDistance * 2;

        const mapSmallerThanWindow =
          drawable.width <= windowWidth && drawable.height <= windowHeight;

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
            x: tilePixels.x - Math.round(windowWidth / 2),
            y: tilePixels.y - Math.round(windowHeight / 2),
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

        if (tileMap.properties.light) {
          tileMapEntity.removeComponent(Weather);
        } else {
          tileMapEntity.addComponent(Weather);
        }

        tileMapEntity.removeComponent(Shop);
        tileMapEntity.addComponent(Shop, {
          shopTiles: tileMap.objectTileStore.getAllByType("shop"),
        });

        this.queries.networkRoom.results.forEach(
          (networkRoomEntity: Entity) => {
            const networkRoom = networkRoomEntity.getMutableComponent(
              NetworkRoom
            );
            networkRoom.room?.leave();
            networkRoom.room = undefined;
          }
        );

        this.queries.remotePlayers.results.forEach((remotePlayer: Entity) => {
          remotePlayer.addComponent(Remove);
        });

        this.queries.items.results.forEach((item: Entity) => {
          item.addComponent(Remove);
        });

        this.queries.enemies.results.forEach((enemy: Entity) => {
          enemy.addComponent(Remove);
        });

        // Everything is good to go!
        loadable.loading = false;
        tileMapEntity.addComponent(Fade, { alpha: 0 });
        tileMapEntity.removeComponent(AnimatedTilesInitiated);
      }
    });
  }
}
