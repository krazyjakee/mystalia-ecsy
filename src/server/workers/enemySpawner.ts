import { readMapFiles, getTilesByType } from "../utilities/mapFiles";
import { Room } from "colyseus";
import MapState from "serverState/map";
import EnemyZone from "./enemies/enemyZone";

export default class ItemSpawner {
  room: Room<MapState>;
  timer: NodeJS.Timeout;
  enemyZones: EnemyZone[] = [];

  constructor(mapName: string, room: Room<MapState>) {
    const maps = readMapFiles();
    const mapData = maps[mapName];

    this.enemyZones =
      getTilesByType("enemyZone", mapData).map(
        zoneConfig => new EnemyZone(zoneConfig, mapData, room)
      ) || [];

    this.room = room;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.enemyZones.forEach(enemyZone => enemyZone.tick());
  }

  dispose() {
    clearInterval(this.timer);
    this.enemyZones.forEach(enemyZone => enemyZone.dispose());
  }
}
