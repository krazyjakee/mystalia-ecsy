import { Vector } from "types/TMJ";
import detectMapBoundary from "../TileMap/detectMapBoundary";

export default (
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
