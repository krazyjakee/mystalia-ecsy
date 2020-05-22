import { flipTile } from "./createDrawableTile";

describe("createDrawableTile", () => {
  describe("#flipTile", () => {
    test("should return the correct tileId", () => {
      const output = flipTile(2147489147);
      expect(output).toStrictEqual({
        tileId: 5499,
        flipHorizontal: true,
        flipVertical: false,
        flipDiagonal: false,
      });
    });

    test("should return the correct tileId diagonal", () => {
      const output = flipTile(2684354909);
      expect(output).toStrictEqual({
        tileId: 349,
        flipHorizontal: true,
        flipVertical: false,
        flipDiagonal: true,
      });
    });
  });
});
