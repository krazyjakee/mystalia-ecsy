import { AStarFinder } from "astar-typescript";
import { Size } from "types/TileMap/standard";
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

export const shortestPathTo = (
  aStar: AStarFinder,
  from: number,
  to: number
) => {};
