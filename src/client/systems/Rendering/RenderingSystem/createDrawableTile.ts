import { DrawableProperties } from "types/drawable";
import { TMJ } from "types/TMJ";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { tileIdToVector } from "utilities/tileMap";

export default (
  sourceTileId: number,
  destinationTileId: number,
  tileSetStore: TileSetStore,
  data: TMJ
) => {
  const { tilesets, width } = data;
  const externalTileSet = tilesets.find(
    (tileset) => tileset.firstgid < sourceTileId
  );
  if (!externalTileSet) return null;
  const tileset = tileSetStore[externalTileSet?.source];
  if (!tileset) return null;

  const sourceVector = tileIdToVector(
    sourceTileId - externalTileSet.firstgid,
    tileset.imagewidth / 32
  );

  const destinationVector = tileIdToVector(destinationTileId, width);

  const tile: DrawableProperties = {
    image: tileset.image,
    sourceHeight: 32,
    sourceWidth: 32,
    sourceX: sourceVector.x * 32,
    sourceY: sourceVector.y * 32,
    x: destinationVector.x * 32,
    y: destinationVector.y * 32,
    width: 32,
    height: 32,
    offset: { x: 0, y: 0 },
  };

  return tile;
};
