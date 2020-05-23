import PlayerState from "@server/components/player";
import { getWorldMapItems, WorldMapItem } from "@server/utilities/mapFiles";
import { Direction } from "types/Grid";
import { isPresent } from "utilities/guards";
import { pixelsToTileId, tileIdToPixels } from "utilities/tileMap";
import { Vector } from "types/TMJ";
import addOffset from "@client/utilities/Vector/addOffset";
import { areColliding } from "utilities/math";
import { ObjectTileStore } from "utilities/ObjectTileStore";

export const movementWalkOff = (
  player: PlayerState,
  mapFileName: string,
  direction?: Direction,
  objectTileStore?: ObjectTileStore
) => {
  const playerTile = player.targetTile;

  if (isPresent(playerTile)) {
    const mapItems = getWorldMapItems();
    const mapItem = mapItems.find((m) => m.fileName === mapFileName);
    if (mapItem && direction) {
      const nextMap = calculateNextMap(
        mapItem,
        mapItems,
        playerTile,
        direction
      );

      if (nextMap.map) {
        const nextTile = calculateNextPosition(nextMap.map, nextMap.position);

        return {
          fileName: nextMap.map.fileName,
          tileId: nextTile,
        };
      }
    }

    if (objectTileStore) {
      return isOnDoor(objectTileStore, playerTile);
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
    if (destination.fileName === source.fileName) return false;

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

export const isOnDoor = (
  objectTileStore: ObjectTileStore,
  playerTile: number
) => {
  const door = objectTileStore.getByType<"door">(playerTile, "door");
  if (door) {
    return {
      fileName: door.value.map,
      tileId: door.value.tile,
    };
  }
};
