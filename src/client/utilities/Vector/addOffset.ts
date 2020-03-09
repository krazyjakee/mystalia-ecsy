import { Vector } from "types/Grid";

export default (input: Vector, offset: Vector) => {
  return {
    x: input.x + offset.x,
    y: input.y + offset.y
  };
};
