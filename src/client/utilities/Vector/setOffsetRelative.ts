import { Vector } from "types/Grid";
import addOffset from "./addOffset";
import detectMapBoundary from "../TileMap/detectMapBoundary";

export default (
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
