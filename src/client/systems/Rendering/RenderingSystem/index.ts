import { System, Not, Entity } from "ecsy";
import { Loadable } from "../../../components/Loadable";
import Drawable from "../../../components/Drawable";
import TileMap from "../../../components/TileMap";
import {
  drawImage,
  drawToShadowCanvas,
  drawableToDrawableProperties,
} from "../../../utilities/drawing";
import { TMJ } from "types/TMJ";
import createDrawableTile from "./createDrawableTile";
import Movement from "../../../components/Movement";
import Position from "../../../components/Position";
import addOffset from "../../../utilities/Vector/addOffset";
import context2d from "../../../canvas";
import AnimatedTile from "../../../components/AnimatedTile";
import Item from "../../../components/Item";
import { DrawableProperties } from "types/drawable";
import { StaticQuery } from "types/ecsy";

export default class TileMapDrawer extends System {
  static queries: StaticQuery = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap],
    },
    players: {
      components: [Not(Loadable), Drawable, Movement, Position],
    },
    loadedItems: {
      components: [Not(Loadable), Item],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity: Entity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const animatedTiles = tileMapEntity.getComponent(AnimatedTile);
      const drawable = tileMapEntity.getComponent(Drawable);

      const { canvasCache, tiles, objectLayerIndex, width, height } = tileMap;
      const { offset } = drawable;
      const data: TMJ = drawable.data;

      context2d.save();

      if (tileMap.properties.light) {
        context2d.beginPath();
        context2d.rect(
          0,
          0,
          Math.max(drawable.width, context2d.canvas.width),
          Math.max(drawable.height, context2d.canvas.height)
        );
        context2d.fillStyle = `black`;
        context2d.fill();
      }

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
          offset: { x: 0, y: 0 },
        };

        const drawableWithOffset = (
          d: DrawableProperties,
          x?: number,
          y?: number
        ) => ({
          ...d,
          offset: addOffset(offset, {
            x: x ? x : 0,
            y: y ? y : 0,
          }),
        });

        drawImage({
          ...baseCanvasProperties,
          image: canvasCache[0],
        });

        animatedTiles.drawables[1].forEach(
          (tile) =>
            tile.drawable && drawImage(drawableWithOffset(tile.drawable))
        );

        this.queries.loadedItems.results.forEach((itemEntity: Entity) => {
          const itemDrawable = itemEntity.getComponent(Drawable);
          drawImage(
            drawableWithOffset(drawableToDrawableProperties(itemDrawable))
          );
        });

        this.queries.players.results.forEach((player: Entity) => {
          const position = player.getComponent(Position);
          const playerDrawable = player.getComponent(Drawable);
          drawImage(
            drawableWithOffset(
              drawableToDrawableProperties(playerDrawable),
              position.value.x * 32,
              position.value.y * 32
            )
          );
        });

        animatedTiles.drawables[0].forEach(
          (tile) =>
            tile.drawable && drawImage(drawableWithOffset(tile.drawable))
        );

        drawImage({
          ...baseCanvasProperties,
          image: canvasCache[1],
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
                tileMap.tileSetStore,
                drawable.data
              );
              if (newTile) {
                tileMap.tiles.push(newTile);
              }
            });
          } else if (!tileMap.objectLayerIndex) {
            tileMap.objectLayerIndex = tileMap.tiles.length;
          }
        }
      }
      context2d.restore();
    });
  }
}
