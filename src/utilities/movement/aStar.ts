import { AStarFinder } from "astar-typescript";
import { TMJ } from "types/TMJ";
import { tilesAdjacent } from "./surroundings";
import { vectorToTileId, tileIdToVector } from "utilities/tileMap";
import memoize from "utilities/memoize";

type AStarFinderExtended = AStarFinder & { blockList?: number[] };
type AStarStore = {
  [key: string]: AStarFinderExtended;
};

class AStar {
  aStarStore: AStarStore = {};

  add(fileName: string, mapData: TMJ, blockList: number[]) {
    const blockGrid = this.getBlockGrid(
      blockList,
      mapData.height,
      mapData.width
    );

    const aStarFinder: AStarFinderExtended = new AStarFinder({
      grid: mapData.layers.length
        ? {
            matrix: blockGrid,
          }
        : { width: 2, height: 2 },
      diagonalAllowed: false,
      includeStartNode: false,
    });
    aStarFinder.blockList = blockList;

    this.aStarStore[fileName] = aStarFinder;
  }

  getBlockGrid(blockList: number[], rows, columns) {
    return Array(rows)
      .fill(0)
      .map((_, index1) => {
        return Array(columns)
          .fill(0)
          .map((_, index2) => {
            const tileId = index1 * columns + index2;
            return blockList.includes(tileId) ? 1 : 0;
          });
      });
  }

  findPath(
    fileName: string,
    sourceTileId: number,
    destinationTileId: number,
    mapColumns: number
  ) {
    if (sourceTileId === destinationTileId) return [];

    const blockList = this.aStarStore[fileName].blockList;
    const sourceTileVector = tileIdToVector(sourceTileId, mapColumns);
    const destinationTileVector = tileIdToVector(destinationTileId, mapColumns);

    if (
      tilesAdjacent(sourceTileVector, destinationTileVector) &&
      blockList &&
      !blockList.includes(destinationTileId)
    ) {
      return [destinationTileId];
    } else {
      const rawPath = this.aStarStore[fileName].findPath(
        sourceTileVector,
        destinationTileVector
      );

      if (!rawPath) return [];
      return rawPath.map((pathItem) =>
        vectorToTileId({ x: pathItem[0], y: pathItem[1] }, mapColumns)
      );
    }
  }
}

const aStar = new AStar();

export default aStar;
