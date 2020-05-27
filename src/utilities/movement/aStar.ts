import { AStarFinder } from "astar-typescript";
import { TMJ, Vector } from "types/TMJ";
import * as memoize from "memoizee";

type AStarStore = {
  [key: string]: AStarFinder;
};

class AStar {
  aStarStore: AStarStore = {};

  add(fileName: string, mapData: TMJ, blockList: number[]) {
    this.aStarStore[fileName] = new AStarFinder({
      grid: mapData.layers.length
        ? {
            matrix: this.getBlockGrid(blockList, mapData.height, mapData.width),
          }
        : { width: 2, height: 2 },
      diagonalAllowed: false,
      includeStartNode: false,
    });
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

  findPath = memoize(
    (fileName: string, sourceVector: Vector, destinationVector: Vector) => {
      return this.aStarStore[fileName].findPath(
        sourceVector,
        destinationVector
      );
    }
  );
}

export default new AStar();
