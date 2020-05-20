import PlayerState from "@server/components/player";
import { readJSONFile } from "../files";
import { readMapFiles } from "../mapFiles";
import { Direction } from "types/Grid";
import { isPresent } from "utilities/guards";
import { pixelsToTileId, tileIdToPixels } from "utilities/tileMap";
import { Vector } from "types/TMJ";
import addOffset from "@client/utilities/Vector/addOffset";
import { areColliding } from "utilities/math";

type WorldMapData = {
  fileName: string;
  x: number;
  y: number;
};

type WorldMapDataFile = {
  maps: WorldMapData[];
  type: string;
};

type WorldMapItem = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const worldData = readJSONFile("./assets/maps/maps.world") as WorldMapDataFile;
const mapData = readMapFiles();

const worldMapItems: WorldMapItem[] = worldData.maps.map((worldMapData) => {
  const { fileName, x, y } = worldMapData;
  const name = fileName.split(".")[0];
  const map = mapData[name];
  return {
    name,
    x,
    y,
    width: map.width * 32,
    height: map.height * 32,
  };
});

export const movementWalkOff = (
  player: PlayerState,
  direction: Direction,
  mapName: string
) => {
  const playerTile = player.targetTile;
  if (isPresent(playerTile)) {
    const mapItem = worldMapItems.find((m) => m.name === mapName);
    if (mapItem) {
      const nextMap = calculateNextMap(
        mapItem,
        worldMapItems,
        playerTile,
        direction
      );

      if (nextMap.map) {
        const nextTile = calculateNextPosition(nextMap.map, nextMap.position);

        return {
          map: nextMap.map.name,
          tileId: nextTile,
        };
      }
    }
  }
};

export const calculateNextMap = (
  source: WorldMapItem,
  destinations: WorldMapItem[],
  playerTile: number,
  direction: Direction
) => {
  const playerPosition = tileIdToPixels(playerTile, source.width / 32);
  const worldPosition = addOffset(source, playerPosition);

  switch (direction) {
    case "n": {
      worldPosition.y -= 32;
      break;
    }
    case "e": {
      worldPosition.x += 32;
      break;
    }
    case "s": {
      worldPosition.y += 32;
      break;
    }
    case "w": {
      worldPosition.x -= 32;
      break;
    }
  }

  const nextMap = destinations.find((destination) => {
    if (destination.name === source.name) return false;

    return areColliding(
      {
        ...worldPosition,
        width: 32,
        height: 32,
      },
      destination
    );
  });

  return {
    map: nextMap,
    position: worldPosition,
  };
};

export const calculateNextPosition = (
  destinationMap: WorldMapItem,
  worldPosition: Vector
) => {
  const newPosition = {
    x: worldPosition.x - destinationMap.x,
    y: worldPosition.y - destinationMap.y,
  };
  return Math.abs(pixelsToTileId(newPosition, destinationMap.width / 32));
};
