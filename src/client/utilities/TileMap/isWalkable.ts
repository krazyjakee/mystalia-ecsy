import TileMap from "../../components/TileMap";

export default (tileMap: TileMap, tile: number) => {
  const obj = tileMap.objectTileStore.get(tile);
  return !obj || obj.type !== "block";
};
