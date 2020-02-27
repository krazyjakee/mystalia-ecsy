import { tileIdToVector } from "./calculations";
import { DrawableProperties } from "types/drawable";
import TileMap from "src/client/components/TileMap";
import Drawable from "src/client/components/Drawable";
import { TMJ } from "types/tmj";

export const createDrawableTile = (
  sourceTileId: number,
  destinationTileId: number,
  tileMap: TileMap,
  drawable: Drawable
) => {
  const { tilesets, width } = drawable.data as TMJ;
  const tileset = tilesets.find(tileset => tileset.firstgid < sourceTileId);

  if (tileset) {
    const sourceVector = tileIdToVector(
      sourceTileId - tileset.firstgid,
      tileset.imagewidth / 32
    );

    const destinationVector = tileIdToVector(destinationTileId, width);

    const tile: DrawableProperties = {
      image: tileMap.tileSetStore[tileset.image],
      sourceHeight: 32,
      sourceWidth: 32,
      sourceX: sourceVector.x * 32,
      sourceY: sourceVector.y * 32,
      x: destinationVector.x * 32,
      y: destinationVector.y * 32,
      width: 32,
      height: 32,
      offset: { x: 0, y: 0 }
    };

    return tile;
  }

  return null;
};
