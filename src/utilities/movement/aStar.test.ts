import { getBlockGrid } from "./aStar";

describe("aStar", () => {
  describe("#getBlockGrid", () => {
    test("generates the correct block grid", () => {
      const blockGrid = getBlockGrid([3, 4, 5], 10, 10);
      expect(blockGrid[0].slice(0, 8)).toStrictEqual([0, 0, 0, 1, 1, 1, 0, 0]);
    });

    test("generates the correct block grid with offset", () => {
      const blockGrid = getBlockGrid([-97, -96, -95], 10, 10, -100);
      expect(blockGrid[0].slice(0, 8)).toStrictEqual([0, 0, 0, 1, 1, 1, 0, 0]);
    });
  });
});
