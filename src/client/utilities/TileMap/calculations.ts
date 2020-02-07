import { Vector } from "types/Grid";

export const tileIdToVector = (number: number, columns: number): Vector => {
  let x = 0;
  let y = 0;
  let i = 0;

  while (i < number) {
    x += 1;
    if (i % columns === columns - 1) {
      y += 1;
      x = 0;
    }
    i += 1;
  }
  return {
    x: x * 32,
    y: y * 32
  };
};

export const vectorToTileId = (x: number, y: number, columns: number) => {
  const column = Math.floor(x / 32);
  const row = Math.floor(y / 32);
  return row * columns + column;
};
