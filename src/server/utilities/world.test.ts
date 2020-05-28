import {
  getWorldSize,
  getWorldTileId,
  generateWorldBlockList,
  getLocalTile,
} from "./world";

describe("world utilities", () => {
  describe("#getWorldSize", () => {
    test("gets the correct size of the world", () => {
      const worldSize = getWorldSize();
      expect(worldSize).toStrictEqual({
        width: 3840,
        height: 4672,
        x: 0,
        y: -320,
      });
    });
  });

  describe("#getWorldTileId", () => {
    test("should get the correct world tile id below zero", () => {
      const worldTileId = getWorldTileId("test", 49);
      expect(worldTileId).toBe(-711);
    });

    test("should get the correct world tile id above zero", () => {
      const worldTileId = getWorldTileId("south", 210);
      expect(worldTileId).toBe(8370);
    });
  });

  describe("#getLocalTile", () => {
    test("should get the correct local tile id below zero", () => {
      const localTileId = getLocalTile(-711);
      expect(localTileId).toStrictEqual({ tileId: 49, fileName: "test" });
    });

    test("should get the correct local tile id above zero", () => {
      const localTileId = getLocalTile(8161);
      expect(localTileId).toStrictEqual({ tileId: 0, fileName: "south" });
    });
  });

  describe("#generateWorldBlockList", () => {
    test("should return a valid block list", () => {
      const blockList = generateWorldBlockList();
      expect(blockList.length).toStrictEqual(2614);
    });
  });
});
