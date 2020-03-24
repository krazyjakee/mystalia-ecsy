import { System, Not, Entity } from "ecsy";
import { Loadable } from "../../components/Loadable";
import Drawable from "../../components/Drawable";
import TileMap from "../../components/TileMap";
import AnimatedTile, {
  AnimatedTilesInitiated
} from "../../components/AnimatedTile";
import { TMJ } from "types/TMJ";
import createAnimatedTiles from "../Map/MapChangeSystem/createAnimatedTiles";
import { tileIdToPixels } from "../../utilities/TileMap/calculations";
import {
  AnimatedTileFrame,
  AnimatedTileDrawable
} from "types/TileMap/AnimatedTiles";

export default class TileAnimationSystem extends System {
  static queries = {
    loadedTileMaps: {
      components: [
        Not(Loadable),
        Not(AnimatedTilesInitiated),
        Drawable,
        TileMap
      ]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const animatedTiles = tileMapEntity.getComponent(AnimatedTile);
      const drawable = tileMapEntity.getComponent(Drawable);

      const data: TMJ = drawable.data;
      const { tilesets } = data;

      animatedTiles.tiles = {};

      for (let i = 0; i < tilesets.length; i += 1) {
        const tileset = tilesets[i];

        if (tileset.tiles) {
          animatedTiles.tiles = {
            ...animatedTiles.tiles,
            ...createAnimatedTiles(
              tileset.tiles,
              tileset.firstgid,
              tileset.imagewidth,
              tileMap.tileSetStore,
              data
            )
          };
        }
      }

      const tileIds = Object.keys(animatedTiles.tiles).map(k => parseInt(k));

      for (const layer of data.layers) {
        if (layer.type === "tilelayer") {
          layer.data.forEach((tile, index) => {
            if (tileIds.includes(tile)) {
              const newTile = animatedTiles.tiles[tile][0].drawable;
              if (newTile) {
                const destination = tileIdToPixels(index, data.width);

                animatedTiles.drawables[
                  index < tileMap.objectLayerIndex ? 0 : 1
                ].push({
                  uid: index,
                  drawable: {
                    ...newTile,
                    x: destination.x,
                    y: destination.y
                  },
                  tileSetTileId: tile
                });
              }
            }
          });
        } else {
          tileMap.objectLayerIndex = tileMap.tiles.length;
        }
      }

      const setNextFrame = (
        index: number,
        animationTile: AnimatedTileDrawable
      ) => {
        const tileStore = animatedTiles.tiles[animationTile.tileSetTileId];
        if (tileStore) {
          const numberOfFrames = tileStore.length;
          const currentFrame = tileStore[index];
          const nextFrame = index + 1 < numberOfFrames ? index + 1 : 0;
          if (animationTile.drawable && currentFrame.drawable) {
            animationTile.drawable.sourceX = currentFrame.drawable.sourceX;
            animationTile.drawable.sourceY = currentFrame.drawable.sourceY;
          }

          setTimeout(
            () => setNextFrame(nextFrame, animationTile),
            currentFrame.interval
          );
        }
      };

      animatedTiles.drawables.forEach(drawables => {
        drawables.forEach(animationTile => {
          setNextFrame(0, animationTile);
        });
      });

      tileMapEntity.addComponent(AnimatedTilesInitiated);
    });
  }
}
