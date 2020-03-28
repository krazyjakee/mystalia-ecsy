export type ObjectTileTypeString = "" | "block" | "door" | "light";

export type BlockTileType = null;

export type DoorTileType = {
  map: string;
  tile: number;
};

export type LightTileType = {
  radius: number;
  color?: string;
  intensity?: number;
};

export type ObjectTileType = DoorTileType | BlockTileType | LightTileType;

export type ObjectTile<T> = {
  name: string;
  type: ObjectTileTypeString;
  value: T;
};

export type ObjectTileStoreType = {
  [key: number]: ObjectTile<any>[];
};
