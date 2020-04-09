import { Vector } from "types/TMJ";

export default (input: Vector, offset: Vector) => {
  return {
    x: input.x + offset.x,
    y: input.y + offset.y,
  };
};
