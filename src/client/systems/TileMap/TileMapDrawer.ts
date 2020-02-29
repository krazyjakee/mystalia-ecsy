import { System, Not, Entity } from "ecsy";
import { Loadable } from "../../components/Loadable";
import Drawable from "../../components/Drawable";
import TileMap from "../../components/TileMap";
import { drawImage, drawToShadowCanvas } from "../../utilities/drawing";
import { TMJ } from "types/tmj";
import { createDrawableTile } from "../../utilities/TileMap/drawTile";
import Movement from "../../components/Movement";
import { scroll } from "../../utilities/TileMap/moveMap";
import Position from "../../components/Position";
import { LocalPlayer } from "../../components/Tags";
import { addOffset } from "../../utilities/TileMap/calculations";

export default class TileMapDrawer extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap]
    },
    player: {
      components: [Not(Loadable), Drawable, Movement, Position, LocalPlayer]
    }
  };

  execute() {
    // @ts-ignore
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);

      const drawable = tileMapEntity.getComponent(Drawable);
      const {
        canvasCache,
        tiles,
        objectLayerIndex,
        objectLayerDrawables,
        width,
        height
      } = tileMap;
      const { offset } = drawable;
      const data: TMJ = drawable.data;

      if (canvasCache.length) {
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

        const localPlayer =
          // @ts-ignore
          (this.queries.player.results.length &&
            // @ts-ignore
            this.queries.player.results[0]) as Entity;
        const position = localPlayer
          ? localPlayer.getComponent(Position)
          : undefined;
        objectLayerDrawables.forEach(objectTile => {
          drawImage({
            ...objectTile,
            offset: position
              ? addOffset(offset, {
                  x: position.value.x * 32,
                  y: position.value.y * 32
                })
              : offset
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
          width * 32,
          height * 32
        ).canvas;

        // Above player
        canvasCache[1] = drawToShadowCanvas(
          tiles.slice(objectLayerIndex),
          width * 32,
          height * 32
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
