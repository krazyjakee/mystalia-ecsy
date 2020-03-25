import TileMap from "../../components/TileMap";

export default (tileMap: TileMap, tile: number | undefined) => {
  if (tile === undefined) return false;
  const tileTypes = tileMap.objectTileStore.getTypes(tile);
  return !tileTypes || !tileTypes.includes("block");
};
