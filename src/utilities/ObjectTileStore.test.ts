import { readMapFiles } from "@server/utilities/mapFiles";
import { ObjectTileStore } from "utilities/ObjectTileStore";

const createObjectTileStore = () => {
  const maps = readMapFiles();
  const data = maps["test"];
  const ots = new ObjectTileStore(data);
  return ots;
};

describe("ObjectTileStore", () => {
  describe("#constructor", () => {
    const ots = createObjectTileStore();
    test("correctly populate blockedTiles", () => {
      expect(ots.blockList).toStrictEqual([
        3,
        13,
        23,
        33,
        43,
        77,
        78,
        79,
        87,
        88,
        89,
        97,
        98,
        99,
      ]);
    });

    test("correctly generate blockGrid", () => {
      const blockGrid = ots.getBlockGrid();
      const firstBlock = blockGrid[0].indexOf(1);
      const otherTileCount = blockGrid[0].filter((tile) => tile === 0).length;
      expect(firstBlock).toBe(3);
      expect(otherTileCount).toBe(9);
    });

    test("correctly pathfind", () => {
      const path = ots.aStar.findPath({ x: 2, y: 0 }, { x: 4, y: 0 });
      const tileIds = path.map((point) => point[0] + point[1] * ots.columns);
      expect(tileIds).toStrictEqual([
        12,
        22,
        32,
        42,
        52,
        53,
        54,
        44,
        34,
        24,
        14,
        4,
      ]);
    });
  });
});
