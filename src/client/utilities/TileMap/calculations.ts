import { Vector } from "types/Grid";

export const tileIdToVector = (number: number, columns: number): Vector => {
  return {
    x: number % columns,
    y: Math.floor(number / columns)
  };
};

export const tileIdToPixels = (number: number, columns: number): Vector => {
  return {
    x: (number % columns) * 32,
    y: Math.floor(number / columns) * 32
  };
};

export const vectorToTileId = ({ x, y }: Vector, columns: number) => {
  const column = Math.floor(x);
  const row = Math.floor(y);
  return row * columns + column;
};
