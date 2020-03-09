import { tileIdToVector } from "../../../utilities/TileMap/calculations";
import { DrawableProperties } from "types/drawable";
import { TMJ } from "types/tmj";
import { TileSetStore } from "types/TileMap/TileSetStore";

export default (
  sourceTileId: number,
  destinationTileId: number,
  tileSetStore: TileSetStore,
  data: TMJ
) => {
  const { tilesets, width } = data;
  const tileset = tilesets.find(tileset => tileset.firstgid < sourceTileId);

  if (tileset) {
    const sourceVector = tileIdToVector(
      sourceTileId - tileset.firstgid,
      tileset.imagewidth / 32
    );

    const destinationVector = tileIdToVector(destinationTileId, width);

    const tile: DrawableProperties = {
      image: tileSetStore[tileset.image],
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
