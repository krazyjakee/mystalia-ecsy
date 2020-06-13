import { System, Not, Entity } from "ecsy";
import { Loadable } from "@client/components/Loadable";
import Drawable from "@client/components/Drawable";
import TileMap from "@client/components/TileMap";
import {
  drawImage,
  drawToShadowCanvas,
  drawableToDrawableProperties,
  drawableWithOffset,
} from "../../../utilities/drawing";
import { TMJ } from "types/TMJ";
import createDrawableTile from "./createDrawableTile";
import Position from "@client/components/Position";
import context2d from "../../../canvas";
import AnimatedTile from "@client/components/AnimatedTile";
import Item from "@client/components/Item";
import Gate from "@client/components/Gate";
import Loot from "@client/components/Loot";

export default class TileMapDrawer extends System {
  static queries = {
    loadedTileMaps: {
      components: [Not(Loadable), Drawable, TileMap],
    },
    players: {
      components: [Not(Loadable), Drawable, Position],
    },
    loadedItems: {
      components: [Not(Loadable), Item],
    },
    gates: {
      components: [Gate],
    },
    loot: {
      components: [Loot],
    },
  };

  execute() {
    this.queries.loadedTileMaps.results.forEach((tileMapEntity) => {
      const tileMap = tileMapEntity.getComponent(TileMap);
      const animatedTiles = tileMapEntity.getComponent(AnimatedTile);
      const drawable = tileMapEntity.getComponent(Drawable);

      const { canvasCache, tiles, objectLayerIndex, width, height } = tileMap;
      const { offset } = drawable;
      const data: TMJ = drawable.data;

      context2d.save();

      context2d.beginPath();
      context2d.rect(0, 0, context2d.canvas.width, context2d.canvas.height);
      context2d.fillStyle = `black`;
      context2d.fill();

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
        };

        drawImage({
          ...baseCanvasProperties,
          image: canvasCache[0],
        });

        animatedTiles.drawables[1].forEach(
          (tile) =>
            tile.drawable &&
            drawImage(drawableWithOffset(tile.drawable, offset))
        );

        this.queries.loadedItems.results.forEach((itemEntity: Entity) => {
          const itemDrawable = itemEntity.getComponent(Drawable);
          drawImage(
            drawableWithOffset(
              drawableToDrawableProperties(itemDrawable),
              offset
            )
          );
        });

        this.queries.players.results.forEach((player: Entity) => {
          const position = player.getComponent(Position);
          const playerDrawable = player.getComponent(Drawable);
          drawImage(
            drawableWithOffset(
              drawableToDrawableProperties(playerDrawable),
              offset,
              position.value.x * 32,
              position.value.y * 32
            )
          );
        });

        animatedTiles.drawables[0].forEach(
          (tile) =>
            tile.drawable &&
            drawImage(drawableWithOffset(tile.drawable, offset))
        );

        this.queries.gates.results.forEach((gate: Entity) => {
          if (!gate.getComponent(Gate).open) {
            const gateDrawable = gate.getComponent(Drawable);
            drawImage(
              drawableWithOffset(
                drawableToDrawableProperties(gateDrawable),
                offset
              )
            );
          }
        });

        this.queries.loot.results.forEach((loot: Entity) => {
          if (loot.getComponent(Loot).items.length) {
            const lootDrawable = loot.getComponent(Drawable);
            drawImage(
              drawableWithOffset(
                drawableToDrawableProperties(lootDrawable),
                offset
              )
            );
          }
        });

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
