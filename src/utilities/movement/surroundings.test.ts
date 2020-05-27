import { ObjectTileStore } from "utilities/ObjectTileStore";
import { readMapFiles } from "@server/utilities/mapFiles";
import {
  tilesInRadiusOf,
  distanceBetweenTiles,
  tilesAtRadiusOf,
  findClosestPath,
  facePosition,
} from "./surroundings";

const createObjectTileStore = () => {
  const maps = readMapFiles();
  const data = maps["test"];
  const ots = new ObjectTileStore(data);
  return ots;
};

describe("surroundings", () => {
  const ots = createObjectTileStore();
  const size = { width: 10, height: 10 };

  describe("#distanceBetweenTiles", () => {
    test("correctly calculate distance", () => {
      let tiles = distanceBetweenTiles(2, 22, size.width);
      expect(tiles).toEqual(2);

      tiles = distanceBetweenTiles(22, 33, size.width);
      expect(tiles).toEqual(1);

      tiles = distanceBetweenTiles(0, 22, size.width);
      expect(tiles).toEqual(2);
    });
  });

  describe("#tilesInRadiusOf", () => {
    test("correctly list valid surrounding tiles with radius 1", () => {
      const tiles = tilesInRadiusOf(25, size);
      expect(tiles).toStrictEqual([14, 15, 16, 24, 26, 34, 35, 36]);
    });

    test("correctly list valid surrounding tiles at Y edge", () => {
      const tilesTop = tilesInRadiusOf(4, size);
      expect(tilesTop).toStrictEqual([3, 5, 13, 14, 15]);

      const tilesBottom = tilesInRadiusOf(94, size);
      expect(tilesBottom).toStrictEqual([83, 84, 85, 93, 95]);
    });

    test("correctly list valid surrounding tiles at X edge", () => {
      const tilesLeft = tilesInRadiusOf(30, size);
      expect(tilesLeft).toStrictEqual([20, 21, 31, 40, 41]);

      const tilesRight = tilesInRadiusOf(39, size);
      expect(tilesRight).toStrictEqual([28, 29, 38, 48, 49]);
    });

    test("correctly list valid surrounding tiles with radius 2", () => {
      const tiles = tilesInRadiusOf(0, size, 2);
      expect(tiles).toStrictEqual([1, 2, 10, 11, 12, 20, 21, 22]);
    });
  });

  describe("#tilesAtRadiusOf", () => {
    test("correctly list tiles at the radius", () => {
      const tiles = tilesAtRadiusOf(0, size, 2);
      expect(tiles).toStrictEqual([2, 12, 20, 21, 22]);
    });
  });

  describe("#findClosestPath", () => {
    test("correctly find the shortest path", () => {
      let path = findClosestPath(ots, 0, 3);
      expect(path).toStrictEqual([1, 2]);

      path = findClosestPath(ots, 0, 23);
      expect(path).toStrictEqual([1, 2, 12]);

      path = findClosestPath(ots, 76, 89);
      expect(path).toStrictEqual([66, 67]);
    });
  });

  describe("#facePosition", () => {
    test("correctly returns direction", () => {
      const mapColumns = 10;
      const eyes = 54;

      let direction = facePosition(eyes, 48, mapColumns);
      expect(direction).toBe("e");

      direction = facePosition(eyes, 4, mapColumns);
      expect(direction).toBe("n");

      direction = facePosition(eyes, 41, mapColumns);
      expect(direction).toBe("w");
    });
  });
});
