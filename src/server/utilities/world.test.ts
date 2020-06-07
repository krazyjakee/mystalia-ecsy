import {
  getWorldSize,
  getWorldTileId,
  generateWorldBlockList,
  getLocalTileId,
  getRandomValidTile,
  pathToRandomTile,
  isValidWorldTile,
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

  describe("#getLocalTileId", () => {
    test("should get the correct local tile id below zero", () => {
      const localTileId = getLocalTileId(-711);
      expect(localTileId).toStrictEqual({ tileId: 49, fileName: "test" });
    });

    test("should get the correct local tile id above zero", () => {
      const localTileId = getLocalTileId(8160);
      expect(localTileId).toStrictEqual({ tileId: 0, fileName: "south" });
    });
  });

  describe("#getRandomValidTile", () => {
    test("should return a random valid tile", () => {
      const randomTile = getRandomValidTile();
      expect(randomTile).toBeTruthy();
    });
  });

  describe("#isValidWorldTile", () => {
    test("should validate a valid tile", () => {
      const validTile = isValidWorldTile(6811);
      expect(validTile).toBeTruthy();
    });

    test("should validate an invalid tile", () => {
      const invalidTile = isValidWorldTile(5749);
      expect(invalidTile).toBeFalsy();
    });
  });

  describe("#pathToRandomTile", () => {
    test("should return a path to a random valid tile", () => {
      const randomPath = pathToRandomTile(1, -118);
      expect(randomPath).toStrictEqual([
        {
          fileName: "first",
          tileId: 2,
        },
        {
          fileName: "test",
          tileId: 92,
        },
      ]);
    });

    test("should return a path to a random valid tile", () => {
      let randomPath = pathToRandomTile(14971, 12428);
      expect(randomPath && randomPath.length).toBeTruthy();
    });
  });
});
