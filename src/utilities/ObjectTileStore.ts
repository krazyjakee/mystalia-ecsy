import {
  ObjectTileStoreType,
  ObjectTile,
  ObjectTileType,
  ObjectTileTypeString,
} from "types/TileMap/ObjectTileStore";
import { vectorToTileId, pixelsToTileId } from "utilities/tileMap";
import { Attributes, Layer, Property, TMJ, ExternalTileSet } from "types/TMJ";
import aStar from "utilities/movement/aStar";
import { makeHash } from "./hash";
import memoize from "./memoize";
import { objectForEach } from "./loops";
import { TileSetStore } from "types/TileMap/TileSetStore";

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

const mapObjectToTileTypes = memoize(
  (object: Attributes, tileMapColumns: number): ObjectTileStoreType => {
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
      let newTileId = startTileId + col + row * tileMapColumns;
      const newObjectTile = {
        name,
        type: type || "block",
        value,
      };

      if (object.gid) {
        newTileId -= tileMapColumns;
      }

      objectTileType[newTileId] = [newObjectTile];

      col += 1;

      if (col === cols) {
        col = 0;
        row += 1;
      }
    }

    return objectTileType;
  }
);

export class ObjectTileStore {
  store: ObjectTileStoreType = {};
  columns: number = 0;
  rows: number = 0;
  uid: string = "";
  blockList: number[] = [];

  constructor(mapData?: TMJ, tileSetStore?: TileSetStore) {
    if (!mapData || !tileSetStore) return;

    const { width, height, layers, tilesets } = mapData;
    this.columns = width;
    this.rows = height;

    layers.forEach((layer) => this.addLayer(layer));
    this.addTilesets(layers, tilesets, tileSetStore);

    const mapProperties = serializeProperties<"mapProps">(mapData.properties);

    if (mapProperties) {
      this.uid = mapProperties.fileName;
    }

    if (!this.uid) {
      this.uid = makeHash(JSON.stringify(mapData));
    }

    this.blockList = this.generateBlockList(height, width);

    aStar.add(this.uid, mapData, this.blockList);
  }

  get(tileId: number) {
    return this.store[tileId];
  }

  getByType<T extends ObjectTileTypeString>(
    tileId: number,
    type: T
  ): ObjectTile<T> | null {
    const objectTile = this.store[tileId];
    if (objectTile) {
      return objectTile.find((tile) => tile.type === type) || null;
    }
    return null;
  }

  getAllByType<T extends ObjectTileTypeString>(
    type: T
  ): { tileId: number; objectTile: ObjectTile<T> }[] {
    let objectTiles: { tileId: number; objectTile: ObjectTile<T> }[] = [];
    for (let key in this.store) {
      const tiles = this.store[key] as ObjectTile<T>[];
      tiles.forEach((tile) => {
        if (tile.type === type) {
          objectTiles.push({
            tileId: parseInt(key),
            objectTile: tile,
          });
        }
      });
    }
    return objectTiles;
  }

  getTypes(tileId: number) {
    const tiles = this.get(tileId);
    if (tiles) {
      return tiles.map((tile) => tile.type);
    }
  }

  set<T extends ObjectTileTypeString>(tileId: number, data: ObjectTile<T>[]) {
    const objectTile = this.store[tileId];
    this.store[tileId] = objectTile ? objectTile.concat(data) : data;
  }

  addLayer(layer: Layer) {
    if (!layer.objects) {
      return;
    }

    layer.objects.forEach((object) => {
      const tileData = mapObjectToTileTypes(object, this.columns);
      objectForEach(
        tileData,
        (tileId, objectTile) =>
          objectTile && this.set(parseInt(tileId), objectTile)
      );
    });
  }

  addTilesets(
    layers: Layer[],
    externalTileSets: ExternalTileSet[],
    tileSetStore: TileSetStore
  ) {
    layers.forEach((layer) => {
      layer.data?.forEach((tileId, index) => {
        const tileSetSource = externalTileSets.find(
          (tileset) => tileset.firstgid < tileId
        );
        if (!tileSetSource?.source) return;

        const tileSetStoreItem = tileSetStore[tileSetSource.source];
        if (tileSetStoreItem.tiles) {
          tileSetStoreItem.tiles.forEach((tile) => {
            if (tileSetSource.firstgid + tile.id != tileId) return;
            if (!tile.objectgroup || !tile.objectgroup.objects) return;
            tile.objectgroup.objects.forEach((objectTile) => {
              const tileData = mapObjectToTileTypes(objectTile, this.columns);
              objectForEach(
                tileData,
                (_, objectTile) => objectTile && this.set(index, objectTile)
              );
            });
          });
        }
      });
    });
  }

  generateBlockList(rows: number, columns: number) {
    return Array(rows * columns)
      .fill(0)
      .map((_, index) => index)
      .filter((_, index) => {
        const tileTypes = this.getTypes(index);
        return tileTypes && tileTypes.includes("block");
      });
  }
}
