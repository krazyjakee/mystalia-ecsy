import { Vector } from "types/TMJ";
import { Size } from "types/TileMap/standard";

export const randomNumberBetween = (max: number, min: number = 1) => {
  return Math.floor(Math.random() * max) + min;
};

export const percentageCalculator = (max: number, input: number) =>
  (input / max) * 100;

type Rect = Vector & Size;
export const areColliding = (input1: Rect, input2: Rect) => {
  return (
    input1.x < input2.x + input2.width &&
    input1.x + input1.width > input2.x &&
    input1.y < input2.y + input2.height &&
    input1.y + input1.height > input2.y
  );
};

export const degreeToRadian = (degree: number) => (degree * Math.PI) / 180;
