export type ObjectTileTypeString = "" | "block" | "door";

export type BlockTileType = null;

export type DoorTileType = {
  map: string;
  tile: number;
};

export type ObjectTileType = DoorTileType | BlockTileType;

export type ObjectTile = {
  name: string;
  type: ObjectTileTypeString;
  value: ObjectTileType;
};

export type ObjectTileStoreType = {
  [key: number]: ObjectTile;
};
