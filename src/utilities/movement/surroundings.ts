import { Size } from "types/TileMap/standard";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { tileIdToVector, vectorToTileId } from "utilities/tileMap";
import { isPresent } from "utilities/guards";

export const tilesInRadiusOf = (
  tileId: number,
  mapSize: Size,
  radius: number = 1
) => {
  const columns = mapSize.width;
  const rows = mapSize.height;
  const radiusWidth = radius * 2 + 1;
  const totalTiles = radiusWidth * radiusWidth;
  const firstTile = tileId - columns * radius - radius;

  const tiles: number[] = [];
  let count = 0;
  let row = 0;
  let column = 0;

  while (count < totalTiles) {
    tiles.push(firstTile + column + row * columns);
    column += 1;
    if (column === radiusWidth) {
      column = 0;
      row += 1;
    }
    count += 1;
  }
  return tiles.filter((tile) => {
    if (tile === tileId || tile < 0 || tile > columns * rows - 1) {
      return false;
    }

    const distance = distanceBetweenTiles(tileId, tile, columns);
    return distance <= radius;
  });
};

export const tilesAtRadiusOf = (
  tileId: number,
  mapSize: Size,
  radius: number = 1
) => {
  const tilesInRadius = tilesInRadiusOf(tileId, mapSize, radius);
  return tilesInRadius.filter(
    (tile) => distanceBetweenTiles(tileId, tile, mapSize.width) === radius
  );
};

export const distanceBetweenTiles = (
  from: number,
  to: number,
  mapColumns: number
) => {
  const fromX = from % mapColumns;
  const toX = to % mapColumns;
  const maxX = Math.max(fromX, toX);
  const minX = Math.min(fromX, toX);
  const x = maxX - minX;

  const fromY = from / mapColumns;
  const toY = to / mapColumns;
  const maxY = Math.max(fromY, toY);
  const minY = Math.min(fromY, toY);
  const y = Math.round(maxY - minY);

  return Math.max(x, y);
};

export const allowedTiles = (tiles: number[], blockList: number[]) =>
  tiles.filter((tileId) => !blockList.includes(tileId));

export const findClosestPath = (
  ots: ObjectTileStore,
  from: number,
  to: number,
  startingRadius: number = 1
) => {
  const { aStar, blockList, columns } = ots;
  let totalRadius = 20;
  let radius = startingRadius - 1;
  const fromVector = tileIdToVector(from, columns);

  while (totalRadius > 0) {
    radius += 1;
    const availablePaths: number[][] = allowedTiles(
      tilesAtRadiusOf(to, { width: columns, height: ots.rows }, radius),
      blockList
    )
      .map((tileId) => tileIdToVector(tileId, columns))
      .map((tileVector) => aStar.findPath(fromVector, tileVector))
      .filter((tilePath) => isPresent(tilePath) && tilePath.length)
      .map((tilePath) =>
        tilePath.map((vectorArray) =>
          vectorToTileId({ x: vectorArray[0], y: vectorArray[1] }, columns)
        )
      );

    availablePaths.sort((a, b) => a.length - b.length);
    const shortestPath = availablePaths[0];

    if (shortestPath) {
      return shortestPath;
    }
    totalRadius -= 1;
  }
};
