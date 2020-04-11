import {
  ObjectTileStoreType,
  ObjectTile,
  ObjectTileType,
  ObjectTileTypeString,
} from "types/TileMap/ObjectTileStore";
import { vectorToTileId, pixelsToTileId } from "utilities/tileMap";
import { Attributes, Layer, Property, TMJ } from "types/TMJ";

const serializeProperties = <T extends ObjectTileTypeString>(
  properties?: Property[]
): ObjectTileType[T] | null => {
  let property: ObjectTileType[T] | null = null;
  if (properties) {
    // Need somewhere to start building the object
    // @ts-ignore
    property = {};
    properties.forEach((objectProperty) => {
      if (objectProperty.name) {
        // @ts-ignore
        property[objectProperty.name] = objectProperty.value;
      }
    });
  }
  return property;
};

const mapObjectToTileTypes = (
  object: Attributes,
  tileMapColumns: number
): ObjectTileStoreType => {
  const objectTileType: ObjectTileStoreType = {};

  const { width, height, x, y, type, name } = object;

  const gridLocked = !["flame"].includes(type);

  const startTileId = gridLocked
    ? vectorToTileId({ x: x / 32, y: y / 32 }, tileMapColumns)
    : pixelsToTileId({ x, y }, tileMapColumns);
  const cols = Math.round(width / 32) || 1;
  const rows = Math.round(height / 32) || 1;
  const value = serializeProperties(object.properties);
  const totalTiles = cols * rows;

  let col = 0;
  let row = 0;

  for (let tileId = 0; tileId < totalTiles; tileId += 1) {
    const newTileId = startTileId + col + row * tileMapColumns;
    const newObjectTile = {
      name,
      type: type || "block",
      value,
    };

    objectTileType[newTileId] = [newObjectTile];

    col += 1;

    if (col === cols) {
      col = 0;
      row += 1;
    }
  }

  return objectTileType;
};

export class ObjectTileStore {
  store: ObjectTileStoreType;
  columns: number = 0;
  rows: number = 0;

  constructor(
    mapData: TMJ | { width: number; height: number; layers: number[] } = {
      width: 0,
      height: 0,
      layers: [],
    }
  ) {
    const { width, height, layers } = mapData;
    this.columns = width;
    this.rows = height;
    this.store = {};
    (layers as Layer[]).forEach((layer) => this.add(layer));
  }

  get(tileId: number) {
    return this.store[tileId];
  }

  getByType<T extends ObjectTileTypeString>(
    tileId: number,
    type: T
  ): ObjectTile<T> | null {
    if (this.store[tileId]) {
      return this.store[tileId].find((tile) => tile.type === type) || null;
    }
    return null;
  }

  getTypes(tileId: number) {
    const tiles = this.get(tileId);
    if (tiles) {
      return tiles.map((tile) => tile.type);
    }
  }

  set<T extends ObjectTileTypeString>(tileId: number, data: ObjectTile<T>[]) {
    this.store[tileId] = this.store[tileId]
      ? this.store[tileId].concat(data)
      : data;
  }

  add(layer: Layer) {
    if (!layer.objects) {
      return;
    }

    layer.objects.forEach((object) => {
      const tileData = mapObjectToTileTypes(object, this.columns);
      Object.keys(tileData).forEach((id) => {
        const tileId = parseInt(id);
        this.set(tileId, tileData[tileId]);
      });
    });
  }

  // Creates an array for A* pathfinding
  getBlockGrid(): number[][] {
    return Array(this.rows)
      .fill(0)
      .map((_, index1) => {
        return Array(this.columns)
          .fill(0)
          .map((_, index2) => {
            const tileId = index1 * this.columns + index2;
            const tileTypes = this.getTypes(tileId);
            return tileTypes && tileTypes.includes("block") ? 1 : 0;
          });
      });
  }
}
