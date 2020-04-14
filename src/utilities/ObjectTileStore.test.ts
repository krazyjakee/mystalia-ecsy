import { readMapFiles } from "../server/utilities/mapFiles";
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
      expect(ots.blockList).toStrictEqual([3, 13, 23, 33, 43]);
    });
  });
});
