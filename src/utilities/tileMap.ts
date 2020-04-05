import { Vector } from "types/Grid";
import {
  ObjectTileTypeString,
  ObjectTileType,
} from "types/TileMap/ObjectTileStore";
import { Property } from "types/TMJ";

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
