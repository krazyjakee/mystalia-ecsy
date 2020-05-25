import { randomNumberBetween } from "./math";

describe("math", () => {
  describe("#randomNumberBetween", () => {
    test("correctly generate random numbers", () => {
      const tries = Array(10000)
        .fill(0)
        .map(() => randomNumberBetween(10, 0));

      const count = Array(10).fill(0);
      count.forEach((_, index) => {
        expect(tries.includes(index)).toBeTruthy();
      });
    });
  });
});
