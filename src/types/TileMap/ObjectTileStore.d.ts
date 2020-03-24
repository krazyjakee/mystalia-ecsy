export type ObjectTileTypeString = "" | "block" | "door" | "light";

export type BlockTileType = null;

export type DoorTileType = {
  map: string;
  tile: number;
};

export type LightTileType = {
  radius: number;
};

export type ObjectTileType = DoorTileType | BlockTileType | LightTileType;

export type ObjectTile = {
  name: string;
  type: ObjectTileTypeString;
  value: ObjectTileType;
};

export type ObjectTileStoreType = {
  [key: number]: ObjectTile;
};
