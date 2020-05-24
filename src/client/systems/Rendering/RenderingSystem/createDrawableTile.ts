import { DrawableProperties } from "types/drawable";
import { TMJ } from "types/TMJ";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { tileIdToVector } from "utilities/tileMap";
import { degreeToRadian, radianToDegree } from "utilities/math";

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
  let flipVertical = false;
  let flipDiagonal = 0;

  if (tileId > flippedDiagonallyFlag) {
    const flippedProperties = flipTile(tileId);
    tileId = flippedProperties.tileId;
    flipVertical = flippedProperties.flipVertical || false;
    flipDiagonal = flippedProperties.flipDiagonal || 0;
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
    flipVertical,
    flipDiagonal,
  };

  return tile;
};

export const flipTile = (tileId) => {
  let flippedVal = 0;
  let flipped = false;
  let rotation = 0;

  const tile =
    tileId &
    ~(flippedHorizontallyFlag | flippedVerticallyFlag | flippedDiagonallyFlag);

  if (tileId > flippedHorizontallyFlag) {
    tileId -= flippedHorizontallyFlag;
    flippedVal += 4;
  }

  if (tileId > flippedVerticallyFlag) {
    tileId -= flippedVerticallyFlag;
    flippedVal += 2;
  }

  if (tileId > flippedDiagonallyFlag) {
    tileId -= flippedDiagonallyFlag;
    flippedVal += 1;
  }

  switch (flippedVal) {
    case 5:
      rotation = Math.PI / 2;
      break;

    case 6:
      rotation = Math.PI;
      break;

    case 3:
      rotation = (3 * Math.PI) / 2;
      break;

    case 4:
      rotation = 0;
      flipped = true;
      break;

    case 7:
      rotation = Math.PI / 2;
      flipped = true;
      break;

    case 2:
      rotation = Math.PI;
      flipped = true;
      break;

    case 1:
      rotation = (3 * Math.PI) / 2;
      flipped = true;
      break;
  }

  return {
    tileId: tile,
    flipDiagonal: radianToDegree(rotation),
    flipVertical: flipped,
  };
};
