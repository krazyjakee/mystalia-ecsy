import { Vector, Attributes, TMJ } from "types/TMJ";
import {
  ObjectTileTypeString,
  ObjectTileType,
  ObjectTile,
} from "types/TileMap/ObjectTileStore";
import { Property } from "types/TMJ";
import { isPresent } from "./guards";
import memoize from "./memoize";

export const tileIdToVector = (number: number, columns: number): Vector => {
  return {
    x: number % columns,
    y: Math.floor(number / columns),
  };
};

export const tileIdToPixels = (
  number: number,
  columns: number,
  tileSize: number = 32
): Vector => {
  return {
    x: (number % columns) * tileSize,
    y: Math.floor(number / columns) * tileSize,
  };
};

export const vectorToTileId = ({ x, y }: Vector, columns: number) => {
  const column = Math.floor(x);
  const row = Math.floor(y);
  return row * columns + column;
};

export const vectorToPixels = ({ x, y }: Vector) => ({ x: x * 32, y: y * 32 });

export const pixelsToTileId = (
  { x, y }: Vector,
  columns: number,
  tileSize: number = 32
) => {
  const column = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);
  return row * columns + column;
};

export const serializeProperties = <
  T extends ObjectTileTypeString = ObjectTileTypeString
>(
  properties?: Property[]
): ObjectTileType[T] | null => {
  let property: ObjectTileType[T];
  if (properties) {
    // @ts-ignore Need somewhere to start building the object
    property = {};
    properties.forEach((objectProperty) => {
      if (objectProperty.name) {
        // @ts-ignore Can't think of a better way to type this right now.
        property[objectProperty.name] = objectProperty.value;
      }
    });
    return property;
  }
  return null;
};

export type ObjectTileAndTileId<T extends ObjectTileTypeString> = {
  tileId: number;
  objectTile: ObjectTile<T>;
};

export type SerializedObjectTile<T extends ObjectTileTypeString> = Omit<
  Attributes,
  "properties"
> & {
  tileId: number;
  properties: ObjectTileType[T];
};

export const getTilesByType = memoize(
  <T extends ObjectTileTypeString>(type: T, mapData: TMJ) => {
    let tiles: SerializedObjectTile<T>[] = [];
    const objectLayers = mapData.layers.filter(
      (layer) => layer.type === "objectgroup"
    );
    objectLayers.forEach((objectLayer) => {
      if (objectLayer.objects) {
        const objectsOfType = objectLayer.objects.filter(
          (object) => object.type === type
        );
        const serializedObjects = objectsOfType
          .map((object) => {
            const serializedObject = serializeProperties<T>(object.properties);
            if (serializedObject) {
              const newObject: SerializedObjectTile<T> = {
                ...object,
                properties: serializedObject,
                tileId: pixelsToTileId(
                  { x: object.x, y: object.y },
                  mapData.width
                ),
              };
              return newObject;
            }
            return null;
          })
          .filter(isPresent);

        tiles = tiles.concat(serializedObjects);
      }
    });
    return tiles;
  }
);
