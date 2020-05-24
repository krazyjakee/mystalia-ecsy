import { flipTile } from "./createDrawableTile";

describe("createDrawableTile", () => {
  describe("#flipTile", () => {
    test("should return the correct tileId diagonal", () => {
      const tiles = [
        {
          originalTileId: 2684354560,
          tileId: 0,
          flipVertical: true,
          flipDiagonal: 0,
        },
        {
          originalTileId: 3221225472,
          tileId: 0,
          flipVertical: false,
          flipDiagonal: 90,
        },
        {
          originalTileId: 1610612736,
          tileId: 0,
          flipVertical: true,
          flipDiagonal: 180,
        },
        {
          originalTileId: 2147483648,
          tileId: 0,
          flipVertical: false,
          flipDiagonal: 270,
        },
        {
          originalTileId: 3758096384,
          tileId: 0,
          flipVertical: false,
          flipDiagonal: 180,
        },
        {
          originalTileId: 1073741824,
          tileId: 0,
          flipVertical: true,
          flipDiagonal: 270,
        },
        {
          originalTileId: 536870912,
          tileId: 0,
          flipVertical: false,
          flipDiagonal: 0,
        },
      ];

      tiles.forEach(({ originalTileId, ...rest }) => {
        const output = flipTile(originalTileId);
        expect([originalTileId, output]).toStrictEqual([originalTileId, rest]);
      });
    });
  });
});
