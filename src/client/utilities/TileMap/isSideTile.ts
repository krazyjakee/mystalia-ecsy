import { Direction } from "types/Grid";

export default (
  columns: number,
  totalTiles: number,
  currentTile: number
): Direction[] => {
  const tileId = currentTile + 1;
  const resultArray: Direction[] = [];
  if (tileId <= columns) {
    resultArray.push("n");
  }
  if (tileId > totalTiles - columns) {
    resultArray.push("s");
  }
  if (tileId % columns === 0) {
    resultArray.push("e");
  }
  if ((tileId - 1) % columns === 0) {
    resultArray.push("w");
  }

  return resultArray;
};
