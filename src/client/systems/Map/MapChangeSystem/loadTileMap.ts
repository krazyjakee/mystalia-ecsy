import Drawable from "../../../components/Drawable";
import TileMap from "../../../components/TileMap";
import { TMJ, Layer } from "types/TMJ";
import { ObjectTileStore } from "../../../utilities/TileMap/ObjectTileStore";
import { TileMapProperties } from "types/TileMap/standard";
import { loadImage, loadData } from "../../../utilities/assets";
import AnimatedTile from "../../../components/AnimatedTile";

export default async (
  dataPath: string,
  drawable: Drawable,
  tileMap: TileMap
) => {
  const result = await loadData(dataPath);
  const data = result.data as TMJ;
  drawable.data = data;

  // Handy map size in tiles
  tileMap.width = data.width;
  tileMap.height = data.height;

  // Handy map size in pixels
  drawable.width = data.width * 32;
  drawable.height = data.height * 32;

  // Layers should be sorted by id so they are rendered in order
  data.layers.sort((a: Layer, b: Layer) => parseInt(a.id) - parseInt(b.id));

  // Create an object store from the object tiles
  tileMap.objectTileStore = new ObjectTileStore(data.width, data.height);
  data.layers.forEach(layer => tileMap.objectTileStore?.add(layer));

  // Set the map name
  tileMap.name =
    data.properties.find(property => property.name === "name")?.value ||
    "first";

  // Set the map properties
  const properties: TileMapProperties = {};
  data.properties.forEach(
    property => (properties[property.name] = property.value)
  );
  tileMap.properties = properties;

  // Setup the astar pathfinding grid
  const aStarGridData = tileMap.objectTileStore.getBlockGrid();
  if (aStarGridData) {
    tileMap.aStar.setGrid(aStarGridData);
    tileMap.aStar.setAcceptableTiles([0]);
  }

  // Save tileset data and download assets
  const { tilesets } = data;
  tilesets.sort((a, b) => b.firstgid - a.firstgid);
  for (let i = 0; i < tilesets.length; i += 1) {
    const tileset = tilesets[i];
    const tileSetImage = await loadImage(`/assets/tilesets/${tileset.image}`);
    if (tileSetImage) {
      tileMap.tileSetStore[tileset.image] = tileSetImage;
    }
  }
};
