import { tileIdToVector } from "./calculations";
import { DrawableProperties } from "types/drawable";
import { TileMap } from "src/client/components/TileMap";
import { Drawable } from "src/client/components/Drawable";
import { TMJ } from "types/tmj";

export const createDrawableTile = (
  sourceTileId: number,
  destinationTileId: number,
  tileMap: TileMap,
  drawable: Drawable
) => {
  const { tilesets } = drawable.data as TMJ;
  const tileset = tilesets.find(tileset => tileset.firstgid < sourceTileId);

  if (tileset) {
    const sourceVector = tileIdToVector(
      sourceTileId - tileset.firstgid,
      tileset.imagewidth / 32
    );

    const destinationVector = tileIdToVector(destinationTileId, tileMap.width);

    const tile: DrawableProperties = {
      image: tileMap.tileSetStore[tileset.image],
      sourceHeight: 32,
      sourceWidth: 32,
      sourceX: sourceVector.x,
      sourceY: sourceVector.y,
      x: destinationVector.x,
      y: destinationVector.y,
      width: 32,
      height: 32,
      offset: drawable.offset
    };

    return tile;
  }

  return null;
};
