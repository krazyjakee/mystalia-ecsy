export type ObjectTileType = {
  "": null;
  block: null;
  door: {
    map: string;
    tile: number;
  };
  light: {
    radius: number;
    color?: string;
    intensity?: number;
  };
  item: {
    itemId: number;
    chance: number;
    quantity?: number;
    maximumQuantity?: number;
  };
};

export type ObjectTileTypeString = keyof ObjectTileType;

export type ObjectTile<T extends ObjectTileTypeString = any> = {
  name: string;
  type: T;
  value: ObjectTileType[T];
};

export type ObjectTileStoreType = {
  [key: number]: ObjectTile[];
};
