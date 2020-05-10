export const randomNumberBetween = (max: number, min: number = 1) => {
  return Math.floor(Math.random() * max) + min;
};

export const percentageCalculator = (max: number, input: number) =>
  (input / max) * 100;
