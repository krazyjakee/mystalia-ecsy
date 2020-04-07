import { SpecialTiles, TMJ } from "types/TMJ";
import { AnimatedTileStore } from "types/TileMap/AnimatedTiles";
import { TileSetStore } from "types/TileMap/TileSetStore";
import createDrawableTile from "../../Rendering/RenderingSystem/createDrawableTile";
import { tileIdToVector } from "utilities/tileMap";

export default (
  specialTiles: SpecialTiles[],
  firstGid: number,
  tileSetWidth: number,
  tileSetStore: TileSetStore,
  tmj: TMJ
): AnimatedTileStore => {
  const animatedTileStore: AnimatedTileStore = {};

  specialTiles.forEach(specialTile => {
    if (specialTile.animation) {
      const tileSetIdOffset = specialTile.id + firstGid;
      animatedTileStore[tileSetIdOffset] = specialTile.animation.map(tile => ({
        drawable:
          createDrawableTile(tile.tileid + firstGid, 0, tileSetStore, tmj) ||
          undefined,
        sourceTile: tileIdToVector(tile.tileid, tileSetWidth / 32),
        interval: tile.duration
      }));
    }
  });

  return animatedTileStore;
};
