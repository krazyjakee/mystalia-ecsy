import {
  getWorldSize,
  getWorldTileId,
  getLocalTileId,
  worldTileIdToPixels,
  worldPixelsToTileId,
} from "./world";

describe("world utilities", () => {
  describe("#getWorldSize", () => {
    test("gets the correct size of the world", () => {
      const worldSize = getWorldSize();
      expect(worldSize).toStrictEqual({
        width: 3872,
        height: 4672,
        x: -32,
        y: -320,
      });
    });
  });

  describe("#getWorldTileId", () => {
    test("should get the correct world tile id below zero", () => {
      const worldTileId = getWorldTileId("test", 49);
      expect(worldTileId).toBe(-722);
    });

    // test("should get the correct world tile id above zero", () => {
    //   const worldTileId = getWorldTileId("south", 210);
    //   expect(worldTileId).toBe(8490);
    // });

    test("should correctly calculate first tileId", () => {
      const worldColumns = 9;
      const wSize = {
        x: -32,
        y: -64,
        width: worldColumns * 32,
        height: 4 * 32,
      };

      expect(
        worldPixelsToTileId({ x: -32, y: -32 }, worldColumns)
      ).toStrictEqual(-10);

      expect(worldTileIdToPixels(-10, worldColumns, wSize)).toStrictEqual({
        x: -32,
        y: -32,
      });

      expect(worldTileIdToPixels(-17, worldColumns, wSize)).toStrictEqual({
        x: 32,
        y: -64,
      });

      expect(worldTileIdToPixels(10, worldColumns, wSize)).toStrictEqual({
        x: 32,
        y: 32,
      });
      expect(worldTileIdToPixels(3, worldColumns, wSize)).toStrictEqual({
        x: 96,
        y: 0,
      });
    });
  });

  describe("#getLocalTileId", () => {
    test("should get the correct local tile id below zero", () => {
      const localTileId = getLocalTileId(-722);
      expect(localTileId).toStrictEqual({ tileId: 49, fileName: "test" });
    });

    test("should get the correct local tile id above zero", () => {
      const localTileId = getLocalTileId(8228);
      expect(localTileId).toStrictEqual({ tileId: 0, fileName: "south" });
    });
  });
});
