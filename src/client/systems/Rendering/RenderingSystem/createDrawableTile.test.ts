import { flipTile } from "./createDrawableTile";

describe("createDrawableTile", () => {
  describe("#flipTile", () => {
    test("should return the correct tileId", () => {
      const output = flipTile(2147489147);
      expect(output).toStrictEqual({
        tileId: 5499,
        flipHorizontal: true,
        flipVertical: false,
        flipDiagonally: false,
      });
    });
  });
});
