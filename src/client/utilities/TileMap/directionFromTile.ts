import { Direction } from "types/Grid";
import { tileIdToVector } from "./calculations";

export default (from: number, to: number, columns: number): Direction => {
  const fromVector = tileIdToVector(from, columns);
  const toVector = tileIdToVector(to, columns);
  if (fromVector.y === toVector.y) {
    return fromVector.x > toVector.x ? "w" : "e";
  }
  return fromVector.y > toVector.y ? "n" : "s";
};
