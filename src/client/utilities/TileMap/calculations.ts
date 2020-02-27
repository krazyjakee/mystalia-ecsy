import { Vector } from "types/Grid";

export const tileIdToVector = (number: number, columns: number): Vector => {
  return {
    x: number % columns,
    y: Math.floor(number / columns)
  };
};

export const vectorToTileId = ({ x, y }: Vector, columns: number) => {
  const column = Math.floor(x);
  const row = Math.floor(y);
  return row * columns + column;
};

export const compassToVector = (compass: string) => {
  switch (compass) {
    case "n":
      return { x: 0, y: -1 };
    case "e":
      return { x: 1, y: 0 };
    case "s":
      return { x: 0, y: 1 };
    case "w":
      return { x: -1, y: 0 };
  }
  return { x: 0, y: 0 };
};

export const addOffset = (input: Vector, offset: Vector) => {
  return {
    x: input.x + offset.x,
    y: input.y + offset.y
  };
};

export const setOffsetRelative = (
  x: number,
  y: number,
  currentOffset: Vector,
  mapWidth: number,
  mapHeight: number
) => {
  const [diff, boundary] = detectMapBoundary(
    x,
    y,
    currentOffset,
    mapWidth,
    mapHeight
  );
  const newOffset = addOffset(
    { x: boundary.x ? 0 : diff.x, y: boundary.y ? 0 : diff.y },
    currentOffset
  );
  return newOffset;
};

export const setOffset = (
  x: number,
  y: number,
  currentOffset: Vector,
  mapWidth: number,
  mapHeight: number
) => {
  const [newOffset] = detectMapBoundary(
    0 - x,
    0 - y,
    currentOffset,
    mapWidth,
    mapHeight
  );

  return newOffset;
};

const detectMapBoundary = (
  x: number,
  y: number,
  currentOffset: Vector,
  mapWidth: number,
  mapHeight: number
): [Vector, { x: boolean; y: boolean }] => {
  const requestX = currentOffset.x + x;
  const requestY = currentOffset.y + y;
  let newX = x;
  let newY = y;
  const boundary = {
    x: false,
    y: false
  };

  if (requestX > 0) {
    boundary.x = true;
    newX = 0;
  } else if (requestX < 0 - (mapWidth - window.innerWidth)) {
    boundary.x = true;
    newX = 0 - (mapWidth - window.innerWidth);
  }

  if (requestY > 0) {
    boundary.y = true;
    newY = 0;
  } else if (requestY < 0 - (mapHeight - window.innerHeight)) {
    boundary.y = true;
    newY = 0 - (mapHeight - window.innerHeight);
  }

  return [{ x: newX, y: newY }, boundary];
};
