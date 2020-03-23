import TileMap from "../../components/TileMap";

export default (tileMap: TileMap, tile: number | undefined) => {
  if (tile === undefined) return false;
  const obj = tileMap.objectTileStore.get(tile);
  return !obj || obj.type !== "block";
};
