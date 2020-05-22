import Enemy from "./enemy";
import MapRoom from "../../rooms/map";
import { readMapFiles } from "@server/utilities/mapFiles";
import MapState from "@server/components/map";
import { ObjectTileStore } from "utilities/ObjectTileStore";

const allowedTiles = [
  11,
  12,
  14,
  15,
  21,
  22,
  24,
  25,
  31,
  32,
  34,
  35,
  41,
  42,
  44,
  45,
  51,
  52,
  53,
  54,
  55,
];

const enemySpec = {
  id: 0,
  name: "Woodland Boar",
  spritesheet: "wildlife/boar",
  portrait: "wild-board",
  spriteId: 0,
  behavior: {
    escape: {
      distance: 5,
      chance: 1,
    },
  },
  speed: 1,
  maxDistance: 1,
  hp: 40,
  abilities: [0],
};

const createMapRoom = () => {
  const room = new MapRoom();
  const maps = readMapFiles();
  const data = maps["test"];
  room.mapData = data;
  room.setState(new MapState());
  room.objectTileStore = new ObjectTileStore(data);
  return room;
};

const createEnemy = () => {
  const enemy = new Enemy(enemySpec, createMapRoom(), allowedTiles);
  enemy.dispose();
  return enemy;
};

describe("Enemy", () => {
  describe("#constructor", () => {
    const enemy = createEnemy();
    test("intitial currentTile is within allowedTiles", () => {
      expect(enemy.allowedTiles.includes(enemy.currentTile));
    });
  });

  describe("#findTilesInRadius", () => {
    const enemy = createEnemy();
    enemy.currentTile = 22;

    test("should only contain allowed tiles", () => {
      const tilesInRadius = enemy.findTilesInRadius();
      const overlap = tilesInRadius.filter((tileInRadius) =>
        enemy.allowedTiles.includes(tileInRadius)
      );
      expect(overlap.length).toBe(tilesInRadius.length);
    });

    test("should contain correct tiles in radius", () => {
      const tilesInRadius = enemy.findTilesInRadius();
      expect(tilesInRadius.length).toBe(6);
    });
  });

  describe("#findNewTargetTile", () => {
    const enemy = createEnemy();
    enemy.currentTile = 22;

    test("should create a valid path", () => {
      enemy.findNewTargetTile();
      expect(enemy.tilePath.length).toBeTruthy();
    });
  });
});
