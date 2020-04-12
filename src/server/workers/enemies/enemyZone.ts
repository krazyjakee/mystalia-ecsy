import Enemy from "./enemy";
import { TMJ, Vector } from "types/TMJ";
import {
  pixelsToTileId,
  tileIdToPixels,
  SerializedObjectTile
} from "utilities/tileMap";
import MapRoom from "../../rooms/map";
import { EnemySpec } from "types/enemies";

const robustPointInPolygon = require("robust-point-in-polygon");
const enemySpecs = require("utilities/data/enemies.json") as EnemySpec[];

export default class EnemyZone {
  objectTile: SerializedObjectTile<"enemyZone">;
  allowedTiles?: number[]; // Tiles within the polygon
  spec: EnemySpec;
  room: MapRoom;
  timer: NodeJS.Timeout;
  enemies: Enemy[] = [];

  constructor(objectTile: SerializedObjectTile<"enemyZone">, room: MapRoom) {
    this.objectTile = objectTile;
    const { enemy } = objectTile.properties;
    this.room = room;

    const spec = enemySpecs.find(spec => spec.id === enemy) || enemySpecs[0];
    this.spec = spec;

    if (room.mapData) {
      this.allowedTiles = this.calculateAllowedTiles(room.mapData);
    }

    // @ts-ignore
    this.timer = setInterval(() => this.tick(), 1000);
  }

  tick() {
    const { chance, max } = this.objectTile.properties;
    if (this.enemies.length < max) {
      const roll = Math.floor(Math.random() * chance) + 1;
      if (roll === 1) {
        this.spawn();
      }
    }
  }

  spawn() {
    if (this.allowedTiles) {
      this.enemies.push(new Enemy(this.spec, this.room, this.allowedTiles));
    }
  }

  calculateAllowedTiles(mapData: TMJ) {
    const columns = mapData.width;
    const { x, y, polygon } = this.objectTile;
    const mostNorthWesterlyPoint = {
      x: x + Math.min(...polygon.map(p => p.x)),
      y: y + Math.min(...polygon.map(p => p.y))
    };
    const mostSouthEasterlyPoint = {
      x: x + Math.max(...polygon.map(p => p.x)),
      y: y + Math.max(...polygon.map(p => p.y))
    };
    const startTile = pixelsToTileId(mostNorthWesterlyPoint, columns);
    const endTile = pixelsToTileId(mostSouthEasterlyPoint, columns);

    const vectorToVectorArray = (input: Vector) => [input.x, input.y];
    const polygonVectorArray = polygon.map(vectorToVectorArray);

    let allowedTiles: number[] = [];
    for (let i = startTile; i < endTile; i += 1) {
      const c = vectorToVectorArray(tileIdToPixels(i, columns));
      const corners = [
        c,
        [c[0] + 32, c[1]],
        [c[0], c[1] + 32],
        [c[0] + 32, c[1] + 32]
      ];
      const tilesInsidePolygon = corners.filter(
        corner => robustPointInPolygon(polygonVectorArray, corner) === -1
      );
      if (tilesInsidePolygon.length === 4) {
        allowedTiles.push(i);
      }
    }

    allowedTiles = allowedTiles.filter(tileId => {
      if (this.room.objectTileStore) {
        const tileTypes = this.room.objectTileStore.getTypes(tileId);
        return tileTypes && tileTypes.includes("block") ? false : true;
      }
    });

    return allowedTiles;
  }

  dispose() {
    clearInterval(this.timer);
    this.enemies.forEach(enemy => enemy.dispose());
  }
}
