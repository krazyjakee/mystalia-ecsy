import MapState from "serverState/map";
import { Room } from "colyseus";
import { makeHash } from "utilities/hash";
import EnemyState from "serverState/enemy";

export default class Enemy {
  stateId: string;
  currentTile: number;
  spec: EnemySpec;
  room: Room<MapState>;
  allowedTiles: number[];
  timer?: NodeJS.Timeout;

  constructor(spec: EnemySpec, room: Room<MapState>, allowedTiles: number[]) {
    this.spec = spec;
    this.room = room;
    this.allowedTiles = allowedTiles;
    this.stateId = `i${makeHash(
      `${new Date().getTime() + new Date().getMilliseconds()}`
    )}`;

    this.currentTile =
      allowedTiles[Math.floor(Math.random() * allowedTiles.length)];
    this.room.state.enemies[this.stateId] = new EnemyState(
      this.spec.id,
      this.currentTile
    );
  }

  tick() {
    // TODO: Create a function to get all tileIds within a distance (random between 1 and this.spec.maxDistance) and filter out blocked tiles (this.allowedTiles)
    // TODO: Use a* to create a path array.
    // TODO: Update the state progressing the path using a timeout based on this.spec.speed.
  }

  destroy() {
    this.dispose();
    delete this.room.state.enemies[this.stateId];
  }

  dispose() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
