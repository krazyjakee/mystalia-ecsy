import TileMap from "../../components/TileMap";

export default (tileMap: TileMap, tile: number | undefined) => {
  if (tile === undefined) return false;
  return !tileMap.objectTileStore.blockList.includes(tile);
};
