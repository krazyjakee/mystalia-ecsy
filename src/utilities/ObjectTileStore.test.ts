import { readMapFiles } from "@server/utilities/mapFiles";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import aStar from "utilities/movement/aStar";

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

    test("ots constructor adds astar data", () => {
      expect(aStar.aStarStore["test"]).toBeTruthy();
    });

    test("correctly pathfind", () => {
      const tileIds = aStar.findPath("test", 2, 4, ots.columns);
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
