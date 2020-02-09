import TileMap from "../../components/TileMap";
import Drawable from "../../components/Drawable";
import Player from "src/client/components/Player";
import { Direction } from "types/Grid";
import { tileIdToVector } from "../TileMap/calculations";

export const setNewCurrentTile = (
  tileMap: TileMap,
  player: Player,
  playerDrawable: Drawable,
  mapColumns: number,
  mapRows: number,
  currentDirection?: Direction
) => {
  const { nextTile, spriteOffset, isEdge, compass } = getNextTileData(
    player,
    mapRows,
    mapColumns,
    currentDirection
  );
  const tileType = tileMap.objectTileStore.getType(nextTile);

  if (isEdge) {
    const nextMap = tileMap.properties[compass];
    if (nextMap) {
      // TODO: Change map logic here
    }
  } else if (tileType !== "block") {
    player.currentTile = nextTile;
    tileMap.targetTile = nextTile;
    player.walking = true;
  }

  playerDrawable.sourceY = spriteOffset;
};

const getNextTileData = (
  player: Player,
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
        spriteOffset: 32,
        isEdge: edge.includes(direction),
        compass: "east"
      };
    }
    case "w": {
      return {
        nextTile: player.currentTile - 1,
        spriteOffset: 96,
        isEdge: edge.includes(direction),
        compass: "west"
      };
    }
    case "n": {
      return {
        nextTile: player.currentTile - mapColumns,
        spriteOffset: 0,
        isEdge: edge.includes(direction),
        compass: "north"
      };
    }
    case "s": {
      return {
        nextTile: player.currentTile + mapColumns,
        spriteOffset: 64,
        isEdge: edge.includes(direction),
        compass: "south"
      };
    }
    default: {
      return {
        nextTile: player.currentTile,
        spriteOffset: 64,
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

export const getTileFromQueue = (player: Player, columns: number) => {
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
