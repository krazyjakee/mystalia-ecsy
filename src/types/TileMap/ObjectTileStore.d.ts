import { Biome } from "utilities/weather";

export type ObjectTileType = {
  "": null;
  block: null;
  gate: null;
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
    id: number;
    chance: number;
    quantity?: number;
    maximumQuantity?: number;
  };
  flame: {
    color?: string;
    blur?: number;
    opacity?: number;
  };
  enemy: {
    id: number;
    chance: number;
    patrolId?: number;
  };
  enemyZone: {
    chance: number;
    enemy: number;
    max: number;
  };
  mapProps: {
    name: string;
    fileName: string;
    biome: Biome;
    light?: number;
  };
  shop: {
    shopId: number;
  };
  patrol: {
    id: number;
  };
};

export type ObjectTileTypeString = keyof ObjectTileType;

export type ObjectTile<T extends ObjectTileTypeString = any> = {
  name: string;
  type: T;
  value: ObjectTileType[T];
};

export type ObjectTileStoreType = {
  [key: number]: ObjectTile[] | undefined;
};
