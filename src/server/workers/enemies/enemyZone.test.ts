import MapRoom from "../../rooms/map";
import { readMapFiles } from "@server/utilities/mapFiles";
import MapState from "@server/components/map";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import EnemyZone from "./enemyZone";
import { getTilesByType } from "utilities/tileMap";
import { TMJ } from "types/TMJ";

export const createMapRoom = () => {
  const room = new MapRoom();
  const maps = readMapFiles();
  const data = maps["test"];
  room.mapData = data;
  room.setState(new MapState());
  room.objectTileStore = new ObjectTileStore(data, {});
  return room;
};

const createEnemyZone = () => {
  const room = createMapRoom();
  const objectTile = getTilesByType("enemyZone", room.mapData as TMJ)[0];
  const enemyZone = new EnemyZone(objectTile, room);
  enemyZone.dispose();
  return enemyZone;
};

describe("EnemyZone", () => {
  describe("#constructor", () => {
    const enemyZone = createEnemyZone();
    test("correctly calculate tiles inside polygon", () => {
      expect(enemyZone.allowedTiles).toStrictEqual([
        2,
        4,
        12,
        14,
        21,
        22,
        24,
        31,
        32,
        34,
        41,
        42,
        44,
        45,
        52,
        53,
        54,
        55,
      ]);
    });
  });
});
