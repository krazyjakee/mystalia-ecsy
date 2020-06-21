import { tileIdToPixels } from "./tileMap";

describe("tileMap", () => {
  describe("#tileIdToPixels", () => {
    test("can convert to correct pixels", () => {
      expect(tileIdToPixels(10, 10)).toStrictEqual({ x: 0, y: 32 });
    });
  });
});
