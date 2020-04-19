import { Vector } from "types/TMJ";
import config from "@client/config.json";

const { allowableOffMapDistance } = config;

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

  if (requestX >= allowableOffMapDistance) {
    boundary.x = true;
    newX = allowableOffMapDistance;
  } else if (
    requestX <
    0 - (mapWidth + allowableOffMapDistance - window.innerWidth)
  ) {
    boundary.x = true;
    newX = 0 - (mapWidth + allowableOffMapDistance - window.innerWidth);
  }

  if (requestY >= allowableOffMapDistance) {
    boundary.y = true;
    newY = allowableOffMapDistance;
  } else if (
    requestY <
    0 - (mapHeight + allowableOffMapDistance - window.innerHeight)
  ) {
    boundary.y = true;
    newY = 0 - (mapHeight + allowableOffMapDistance - window.innerHeight);
  }

  return [{ x: newX, y: newY }, boundary];
};
