import { flipTile } from "./createDrawableTile";

describe("createDrawableTile", () => {
  describe("#flipTile", () => {
    test("should return the correct tileId diagonal", () => {
      const tiles = [
        {
          originalTileId: 2684354560,
          tileId: 0,
          flipHorizontal: false,
          flipVertical: false,
          flipDiagonal: true,
        },
        {
          originalTileId: 3221225472,
          tileId: 0,
          flipHorizontal: false,
          flipVertical: true,
          flipDiagonal: false,
        },
        {
          originalTileId: 1610612736,
          tileId: 0,
          flipHorizontal: false,
          flipVertical: true,
          flipDiagonal: true,
        },
        {
          originalTileId: 2147483648,
          tileId: 0,
          flipHorizontal: true,
          flipVertical: false,
          flipDiagonal: false,
        },
        {
          originalTileId: 3758096384,
          tileId: 0,
          flipHorizontal: true,
          flipVertical: false,
          flipDiagonal: true,
        },
        {
          originalTileId: 1073741824,
          tileId: 0,
          flipHorizontal: true,
          flipVertical: true,
          flipDiagonal: false,
        },
        {
          originalTileId: 536870912,
          tileId: 0,
          flipHorizontal: true,
          flipVertical: true,
          flipDiagonal: true,
        },
      ];

      tiles.forEach(({ originalTileId, ...rest }) => {
        const output = flipTile(originalTileId);
        expect([originalTileId, output]).toStrictEqual([originalTileId, rest]);
      });
    });
  });
});
