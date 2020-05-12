import { TileSet } from "types/TMJ";

export type TileSetStore = {
  [key: string]: Omit<TileSet, "image"> & {
    image: HTMLImageElement | null;
  };
};
