import {
  ObjectTileStoreType,
  ObjectTile,
  ObjectTileType
} from "types/TileMap/ObjectTileStore";
import { vectorToTileId } from "./calculations";
import { Property, Attributes, Layer } from "types/tmj";

const serializeProperties = (properties?: Property[]): ObjectTileType => {
  let property: ObjectTileType = null;
  if (properties) {
    // @ts-ignore Need somewhere to start building the object
    property = {};
    properties.forEach(objectProperty => {
      if (objectProperty.name) {
        // @ts-ignore Can't think of a better way to type this right now.
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
  const startTileId = vectorToTileId({ x: x / 32, y: y / 32 }, tileMapColumns);
  const cols = Math.round(width / 32);
  const rows = Math.round(height / 32);
  const value = serializeProperties(object.properties);
  const totalTiles = cols * rows;

  let col = 0;
  let row = 0;

  for (let tileId = 0; tileId < totalTiles; tileId += 1) {
    const newTileId = startTileId + col + row * tileMapColumns;
    objectTileType[newTileId] = {
      name,
      type: type || "block",
      value
    };

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

  constructor(mapColumns: number, mapRows: number) {
    this.columns = mapColumns;
    this.rows = mapRows;
    this.store = {};
  }

  get(tileId: number) {
    return this.store[tileId];
  }

  getType(tileId: number) {
    const tile = this.get(tileId);
    if (tile) {
      return tile.type;
    }
  }

  set(tileId: number, data: ObjectTile) {
    this.store[tileId] = data;
  }

  add(layer: Layer) {
    if (!layer.objects) {
      return;
    }

    layer.objects.forEach(object => {
      const tileData = mapObjectToTileTypes(object, this.columns);
      Object.keys(tileData).forEach(id => {
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
            const tile = this.store[tileId];
            return tile && tile.type === "block" ? 1 : 0;
          });
      });
  }
}
