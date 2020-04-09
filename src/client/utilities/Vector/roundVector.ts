import { Vector } from "types/TMJ";

export default (v: Vector) => {
  return { x: Math.round(v.x), y: Math.round(v.y) };
};
