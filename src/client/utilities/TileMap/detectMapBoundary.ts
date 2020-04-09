import { Vector } from "types/Grid";

export default (
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
    y: false,
  };

  if (requestX >= 0) {
    boundary.x = true;
    newX = 0;
  } else if (requestX < 0 - (mapWidth - window.innerWidth)) {
    boundary.x = true;
    newX = 0 - (mapWidth - window.innerWidth);
  }

  if (requestY >= 0) {
    boundary.y = true;
    newY = 0;
  } else if (requestY < 0 - (mapHeight - window.innerHeight)) {
    boundary.y = true;
    newY = 0 - (mapHeight - window.innerHeight);
  }

  return [{ x: newX, y: newY }, boundary];
};
