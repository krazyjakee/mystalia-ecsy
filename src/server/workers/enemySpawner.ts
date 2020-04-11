import { readMapFiles } from "../utilities/mapFiles";
import EnemyZone from "./enemies/enemyZone";
import { getTilesByType } from "utilities/tileMap";
import MapRoom from "../rooms/map";

export default class EnemySpawner {
  room: MapRoom;
  timer: NodeJS.Timeout;
  enemyZones: EnemyZone[] = [];

  constructor(mapName: string, room: MapRoom) {
    const maps = readMapFiles();
    const mapData = maps[mapName];

    this.enemyZones =
      getTilesByType("enemyZone", mapData).map(
        (zoneConfig) => new EnemyZone(zoneConfig, mapData, room)
      ) || [];

    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.enemyZones.forEach((enemyZone) => enemyZone.tick());
  }

  dispose() {
    clearInterval(this.timer);
    this.enemyZones.forEach((enemyZone) => enemyZone.dispose());
  }
}
