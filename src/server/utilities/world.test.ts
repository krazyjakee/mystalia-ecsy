import { getWorldSize, getWorldTileId, generateWorldBlockList } from "./world";

describe("world utilities", () => {
  describe("#getWorldSize", () => {
    test("gets the correct size of the world", () => {
      const worldSize = getWorldSize();
      expect(worldSize).toStrictEqual({
        width: 120,
        height: 146,
        x: 0,
        y: -320,
      });
    });
  });

  describe("#getWorldTileId", () => {
    test("should get the correct world tile id below zero", () => {
      const worldTileId = getWorldTileId("test", 49, 10);
      expect(worldTileId).toBe(-51);
    });

    test("should get the correct world tile id above zero", () => {
      const worldTileId = getWorldTileId("south", 210, 120);
      expect(worldTileId).toBe(8370);
    });
  });

  describe("#generateWorldBlockList", () => {
    test("should return a valid block list", () => {
      const blockList = generateWorldBlockList();
      expect(blockList.length).toStrictEqual(2614);
    });
  });
});
