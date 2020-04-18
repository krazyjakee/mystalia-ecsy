import { Direction } from "types/Grid";
import { Size } from "types/TileMap/standard";

export const generateAnimationSteps = (
  direction: Direction = "s",
  { width, height }: Size = {
    width: 24,
    height: 32,
  }
) => {
  const ys = {
    n: 0,
    e: height,
    s: height * 2,
    w: height * 3,
  };
  const y = ys[direction];

  return [
    {
      x: width,
      y,
    },
    {
      x: width * 2,
      y,
    },
    {
      x: 0,
      y,
    },
  ];
};
