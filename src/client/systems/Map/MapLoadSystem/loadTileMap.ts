import Drawable from "@client/components/Drawable";
import TileMap from "@client/components/TileMap";
import { TMJ, Layer, TileSet } from "types/TMJ";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { TileMapProperties } from "types/TileMap/standard";
import { loadImage, loadData } from "../../../utilities/assets";

export default async (
  dataPath: string,
  drawable: Drawable,
  tileMap: TileMap
) => {
  const data = (await loadData(dataPath)) as TMJ;
  drawable.data = data;

  // Handy map size in tiles
  tileMap.width = data.width;
  tileMap.height = data.height;

  // Handy map size in pixels
  drawable.width = data.width * 32;
  drawable.height = data.height * 32;

  // Set the map properties
  const properties: TileMapProperties = {};
  data.properties.forEach(
    (property) => (properties[property.name] = property.value)
  );
  tileMap.properties = properties;

  // Set the map name
  tileMap.fileName = tileMap.properties.fileName || "first";

  // Save tileset data and download assets
  const { tilesets } = data;
  tilesets.sort((a, b) => b.firstgid - a.firstgid);
  for (let i = 0; i < tilesets.length; i += 1) {
    const externalTileSet = tilesets[i];
    const dataPath = externalTileSet.source.slice(
      externalTileSet.source.indexOf("tilesets/") + 9
    );
    const tileset = (await loadData(`/assets/tilesets/${dataPath}`)) as TileSet;
    const tileSetImage = await loadImage(
      `/assets/tilesets/${dataPath.slice(0, dataPath.lastIndexOf("/") + 1)}${
        tileset.image
      }`
    );
    if (tileSetImage) {
      tileMap.tileSetStore[externalTileSet.source] = {
        ...tileset,
        gid: externalTileSet.firstgid,
        image: tileSetImage,
      };
    }
  }

  // Create an object store from the object tiles
  tileMap.objectTileStore = new ObjectTileStore(data, tileMap.tileSetStore);
};
