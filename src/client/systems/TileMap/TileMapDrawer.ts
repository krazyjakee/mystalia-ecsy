import { System, Not, Entity } from "ecsy";
import { Loadable } from "../../components/Loadable";
import Drawable from "../../components/Drawable";
import TileMap from "../../components/TileMap";
import { drawImage, drawToShadowCanvas } from "../../utilities/drawing";
import { TMJ } from "types/tmj";
import { createDrawableTile } from "../../utilities/TileMap/drawTile";
import Player from "../../components/Player";
import { scroll } from "../../utilities/TileMap/moveMap";

export default class TileMapDrawer extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), Drawable, Player]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      if (!tileMap.loaded) {
        return;
      }

      const drawable = tileMapEntity.getComponent(Drawable);
      const {
        canvasCache,
        tiles,
        objectLayerIndex,
        objectLayerDrawables,
        width,
        height,
        targetTile
      } = tileMap;
      const { offset } = drawable;
      const data: TMJ = drawable.data;

      if (canvasCache.length) {
        scroll(width, height, drawable, targetTile);

        const baseCanvasProperties = {
          sourceX: 0 - offset.x,
          sourceY: 0 - offset.y,
          sourceWidth: window.innerWidth,
          sourceHeight: window.innerHeight,
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          offset: { x: 0, y: 0 }
        };

        drawImage({
          ...baseCanvasProperties,
          image: canvasCache[0]
        });

        objectLayerDrawables.forEach(objectTile => {
          drawImage({
            ...objectTile,
            offset
          });
        });

        drawImage({
          ...baseCanvasProperties,
          image: canvasCache[1]
        });
      } else if (tiles.length) {
        // Below player
        canvasCache[0] = drawToShadowCanvas(
          tiles.slice(0, objectLayerIndex),
          width,
          height
        ).canvas;

        // Above player
        canvasCache[1] = drawToShadowCanvas(
          tiles.slice(objectLayerIndex),
          width,
          height
        ).canvas;
      } else {
        // Create a cached set of Sprites for each tile.
        tileMap.tiles = [];
        for (const layer of data.layers) {
          if (layer.type === "tilelayer") {
            layer.data.forEach((tile, index) => {
              const newTile = createDrawableTile(
                tile,
                index,
                tileMap,
                drawable
              );
              if (newTile) {
                tileMap.tiles.push(newTile);
              }
            });
          } else {
            tileMap.objectLayerIndex = tileMap.tiles.length;
          }
        }
      }
    });
  }
}
