import { Vector } from "types/TMJ";
import { Size } from "types/TileMap/standard";
import addOffset from "./addOffset";

type Rect = Vector & Size;
export const areColliding = (input1: Rect, input2: Rect, offset: Vector) => {
  return (
    input1.x < input2.x + input2.width &&
    input1.x + input1.width > input2.x &&
    input1.y < input2.y + input2.height &&
    input1.y + input1.height > input2.y
  );
};
