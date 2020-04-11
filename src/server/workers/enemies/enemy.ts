import MapState from "serverState/map";
import { Room } from "colyseus";

export default class Enemy {
  spec: EnemySpec;
  room: Room<MapState>;

  constructor(spec: EnemySpec, room: Room<MapState>) {
    this.spec = spec;
    this.room = room;
  }

  dispose() {}
}
