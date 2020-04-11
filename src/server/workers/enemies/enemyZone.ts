import enemySpecsData from "utilities/data/enemies.json";
import { Room } from "colyseus";
import MapState from "serverState/map";
import Enemy from "./enemy";
import { SerializedObjectTile } from "src/server/utilities/mapFiles";
import { TMJ } from "types/TMJ";

const enemySpecs = enemySpecsData as EnemySpec[];

export default class EnemyZone {
  chance: number; // Chance of spawning a new enemy (1 in n)
  enemyId: number; // The enemy ID
  max: number; // The maximum number of enemies in the zone
  spec: EnemySpec;
  room: Room<MapState>;
  timer: NodeJS.Timeout;
  enemies: Enemy[] = [];

  constructor(
    objectTile: SerializedObjectTile<"enemyZone">,
    mapData: TMJ,
    room: Room<MapState>
  ) {
    const { chance, enemy, max } = objectTile.properties;
    this.chance = chance;
    this.enemyId = enemy;
    this.max = max;
    this.room = room;

    const spec = enemySpecs.find(spec => spec.id === enemy) || enemySpecs[0];
    this.spec = spec;

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.enemies.length < this.max) {
      if (Math.floor(Math.random() * this.chance) === 1) {
        this.spawn();
      }
    }
  }

  spawn() {
    this.enemies.push(new Enemy(this.spec, this.room));
  }

  setAllowedTiles() {
    // TODO: Create a list of all TileIds that are within the polygon.
  }

  dispose() {
    clearInterval(this.timer);
    this.enemies.forEach(enemy => enemy.dispose());
  }
}
