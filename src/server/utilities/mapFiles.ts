import * as fs from "fs";
import { getMapProperties } from "./tmjTools";
import { TMJ, Attributes } from "types/TMJ";
import {
  ObjectTileType,
  ObjectTileTypeString
} from "types/TileMap/ObjectTileStore";
import { isPresent } from "utilities/guards";
import { pixelsToTileId, serializeProperties } from "utilities/tileMap";

type MapDataCache = { [key: string]: TMJ };
let mapCache: MapDataCache;

export const readMapFiles = () => {
  if (mapCache) {
    return mapCache;
  }

  const dir = fs.opendirSync("./assets/maps");
  let maps: MapDataCache = {};

  let file;
  while ((file = dir.readSync()) !== null) {
    if (file.name.includes(".json")) {
      const rawBuffer = fs
        .readFileSync(`./assets/maps/${file.name}`)
        .toString();
      const json = JSON.parse(rawBuffer);
      const properties = getMapProperties(json);
      maps[properties.name] = json;
    }
  }

  dir.closeSync();

  mapCache = maps;

  return maps;
};

export type SerializedObjectTile<T extends ObjectTileTypeString> = Omit<
  Attributes,
  "properties"
> & {
  tileId: number;
  properties: ObjectTileType[T];
};

export const getTilesByType = <T extends ObjectTileTypeString>(
  type: T,
  mapData: TMJ
) => {
  let tiles: SerializedObjectTile<T>[] = [];
  const objectLayers = mapData.layers.filter(
    layer => layer.type === "objectgroup"
  );
  objectLayers.forEach(objectLayer => {
    if (objectLayer.objects) {
      const objectsOfType = objectLayer.objects.filter(
        object => object.type === type
      );
      const serializedObjects = objectsOfType
        .map(object => {
          const serializedObject = serializeProperties<T>(object.properties);
          if (serializedObject) {
            const newObject: SerializedObjectTile<T> = {
              ...object,
              properties: serializedObject,
              tileId: pixelsToTileId(
                { x: object.x, y: object.y },
                mapData.width
              )
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
};
