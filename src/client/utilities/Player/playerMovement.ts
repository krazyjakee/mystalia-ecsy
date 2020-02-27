import TileMap from "../../components/TileMap";
import Drawable from "../../components/Drawable";
import Movement from "src/client/components/Movement";
import { Direction } from "types/Grid";
import { tileIdToVector } from "../TileMap/calculations";

export const setNewCurrentTile = (
  tileMap: TileMap,
  playerMovement: Movement,
  mapColumns: number,
  mapRows: number,
  currentDirection?: Direction
) => {
  const { nextTile, isEdge, compass } = getNextTileData(
    playerMovement,
    mapRows,
    mapColumns,
    currentDirection
  );
  const tileType = tileMap.objectTileStore.getType(nextTile);

  if (isEdge) {
    const nextMap = tileMap.properties[compass];
    if (nextMap) {
      return nextMap;
    }
  } else if (tileType !== "block") {
    playerMovement.currentTile = nextTile;
    tileMap.targetTile = nextTile;
    playerMovement.walking = true;
  }
};

const getNextTileData = (
  player: Movement,
  mapRows: number,
  mapColumns: number,
  currentDirection?: Direction
) => {
  const totalTiles = mapColumns * mapRows;

  const edge = isSideTile(mapColumns, totalTiles, player.currentTile);

  let direction = currentDirection;

  if (player.tileQueue.length) {
    direction = getTileFromQueue(player, mapColumns);
  }

  switch (direction) {
    case "e": {
      return {
        nextTile: player.currentTile + 1,
        isEdge: edge.includes(direction),
        compass: "east"
      };
    }
    case "w": {
      return {
        nextTile: player.currentTile - 1,
        isEdge: edge.includes(direction),
        compass: "west"
      };
    }
    case "n": {
      return {
        nextTile: player.currentTile - mapColumns,
        isEdge: edge.includes(direction),
        compass: "north"
      };
    }
    case "s": {
      return {
        nextTile: player.currentTile + mapColumns,
        isEdge: edge.includes(direction),
        compass: "south"
      };
    }
    default: {
      return {
        nextTile: player.currentTile,
        isEdge: false,
        compass: "south"
      };
    }
  }
};

export const isSideTile = (
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

export const getTileFromQueue = (player: Movement, columns: number) => {
  const nextTile = player.tileQueue.shift();
  if (nextTile) {
    return directionFromTile(player.currentTile, nextTile, columns);
  }
};

const directionFromTile = (
  from: number,
  to: number,
  columns: number
): Direction => {
  const fromVector = tileIdToVector(from, columns);
  const toVector = tileIdToVector(to, columns);
  if (fromVector.y === toVector.y) {
    return fromVector.x > toVector.x ? "w" : "e";
  }
  return fromVector.y > toVector.y ? "n" : "s";
};
