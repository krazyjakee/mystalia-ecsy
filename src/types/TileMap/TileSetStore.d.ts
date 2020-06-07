import { TileSet } from "types/TMJ";

export type TileSetStoreItem = Omit<TileSet, "image"> & {
  image: HTMLImageElement | null;
};

export type TileSetStore = {
  [key: string]: TileSetStoreItem;
};
