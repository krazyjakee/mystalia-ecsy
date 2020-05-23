import { DrawableProperties } from "types/drawable";
import { TMJ } from "types/TMJ";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { tileIdToVector } from "utilities/tileMap";

const flippedHorizontallyFlag = 0x80000000;
const flippedVerticallyFlag = 0x40000000;
const flippedDiagonallyFlag = 0x20000000;

export default (
  sourceTileId: number,
  destinationTileId: number,
  tileSetStore: TileSetStore,
  data: TMJ
) => {
  const { tilesets, width } = data;

  let tileId = sourceTileId;
  let flipHorizontal = false;
  let flipVertical = false;
  let flipDiagonal = false;

  if (tileId > flippedDiagonallyFlag) {
    const flippedProperties = flipTile(tileId);
    tileId = flippedProperties.tileId;
    flipHorizontal = flippedProperties.flipHorizontal || false;
    flipVertical = flippedProperties.flipVertical || false;
    flipDiagonal = flippedProperties.flipDiagonal || false;
  }

  const externalTileSet = tilesets.find((tileset) => tileset.firstgid < tileId);
  if (!externalTileSet) return null;
  const tileset = tileSetStore[externalTileSet?.source];
  if (!tileset) return null;

  const sourceVector = tileIdToVector(
    tileId - externalTileSet.firstgid,
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
    flipHorizontal,
    flipVertical,
    flipDiagonal,
  };

  return tile;
};

export const flipTile = (tileId) => {
  const flipHorizontal = (tileId & flippedHorizontallyFlag) > 0;
  const flipVertical = (tileId & flippedVerticallyFlag) > 0;
  const flipDiagonal = (tileId & flippedDiagonallyFlag) > 0;

  const tile =
    tileId &
    ~(flippedHorizontallyFlag | flippedVerticallyFlag | flippedDiagonallyFlag);

  return {
    tileId: tile,
    flipDiagonal,
    flipVertical,
    flipHorizontal,
  };
};
