import {
  movementWalkOff,
  calculateNextMap,
  calculateNextPosition,
} from "./map";
import PlayerState from "@server/components/player";
import { User } from "@colyseus/social";
import { createMapRoom } from "@server/workers/enemies/enemyZone.test";

const createPlayerState = (targetTile: number) => {
  const playerState = new PlayerState(new User({ metadata: {} }), "first");
  playerState.targetTile = targetTile;
  return playerState;
};

describe("MapCommandHandler", () => {
  let mapCount = 0;

  const mapA = {
    fileName: "0",
    width: 128,
    height: 128,
    x: 0,
    y: 0,
  };

  const generateMap = (x, y) => ({
    fileName: `${(mapCount += 1)}`,
    width: 64,
    height: 64,
    x,
    y,
  });

  const mapB = generateMap(0, -64);
  const mapC = generateMap(64, -64);
  const mapD = generateMap(128, 0);
  const mapE = generateMap(128, 64);
  const mapF = generateMap(0, 128);
  const mapG = generateMap(64, 128);
  const mapH = generateMap(-64, 0);
  const mapI = generateMap(-64, 64);

  const mapRoom = createMapRoom();

  describe("#calculateNextMap", () => {
    test("correctly resolve next map", () => {
      const nextA = calculateNextMap(mapA, [mapA, mapB, mapC], 3, "n");
      expect(nextA).toStrictEqual({ map: mapC, position: nextA.position });
      const nextB = calculateNextMap(mapA, [mapA, mapD, mapE], 15, "e");
      expect(nextB).toStrictEqual({ map: mapE, position: nextB.position });
      const nextC = calculateNextMap(mapA, [mapA, mapF, mapG], 12, "s");
      expect(nextC).toStrictEqual({ map: mapF, position: nextC.position });
      const nextD = calculateNextMap(mapA, [mapA, mapH, mapI], 0, "w");
      expect(nextD).toStrictEqual({ map: mapH, position: nextD.position });

      const nextE = calculateNextMap(mapA, [mapA, mapB, mapC], 0, "n");
      expect(nextE).toStrictEqual({ map: mapB, position: nextE.position });
      const nextF = calculateNextMap(mapA, [mapA, mapD, mapE], 3, "e");
      expect(nextF).toStrictEqual({ map: mapD, position: nextF.position });
      const nextG = calculateNextMap(mapA, [mapA, mapF, mapG], 15, "s");
      expect(nextG).toStrictEqual({ map: mapG, position: nextG.position });
      const nextH = calculateNextMap(mapA, [mapA, mapH, mapI], 12, "w");
      expect(nextH).toStrictEqual({ map: mapI, position: nextH.position });
    });
  });

  describe("#calculateNextPosition", () => {
    test("correctly resolve next position", () => {
      const nextA = calculateNextPosition(mapC, { x: 96, y: -32 });
      expect(nextA).toEqual(3);
      const nextB = calculateNextPosition(mapG, { x: 96, y: 128 });
      expect(nextB).toEqual(1);
      const nextC = calculateNextPosition(mapF, { x: 128, y: 32 });
      expect(nextC).toEqual(2);
      const nextD = calculateNextPosition(mapI, { x: 32, y: -32 });
      expect(nextD).toEqual(3);
    });
  });

  describe("#movementWalkOff", () => {
    test("correctly resolve next map and position", () => {
      if (!mapRoom.objectTileStore) return;
      const nextMap = movementWalkOff(createPlayerState(8128), "first", "s");
      expect(nextMap).toStrictEqual({ fileName: "south", tileId: 88 });
    });

    test("correctly detect a player is on a door", () => {
      if (!mapRoom.objectTileStore) return;
      const nextMap = movementWalkOff(
        createPlayerState(36),
        "test",
        undefined,
        mapRoom.objectTileStore
      );
      expect(nextMap).toStrictEqual({ fileName: "first", tileId: 4 });
    });
  });
});
