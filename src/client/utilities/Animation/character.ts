import { Direction } from "types/Grid";

export const generateAnimationSteps = (direction: Direction = "s") => {
  const ys = {
    n: 0,
    e: 32,
    s: 64,
    w: 96
  };
  const y = ys[direction];

  return [
    {
      x: 24,
      y
    },
    {
      x: 48,
      y
    },
    {
      x: 0,
      y
    }
  ];
};
