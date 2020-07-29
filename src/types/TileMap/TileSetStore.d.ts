import { TileSet } from "types/TMJ";

export type TileSetStoreItem = Omit<TileSet, "image"> & {
  gid: number;
  image: HTMLImageElement | null;
};

export type TileSetStore = {
  [key: string]: TileSetStoreItem;
};
