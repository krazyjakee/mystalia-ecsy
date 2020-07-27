import { ObjectTileTypeString } from "./TileMap/ObjectTileStore";

export type Vector = {
  x: number;
  y: number;
};

interface Attributes {
  gid?: number;
  height: number;
  name: string;
  properties: Property[];
  rotation: number;
  polygon: Vector[];
  type: ObjectTileTypeString;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export type LayerType = "tilelayer" | "objectgroup";

interface Layer {
  id: string;
  data: number[];
  height: number;
  name: string;
  opacity: number;
  type: LayerType;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  draworder: string;
  objects?: Attributes[];
  properties: Property[];
}

interface AnimatedTile {
  duration: number;
  tileid: number;
}

interface SpecialTiles {
  id: number;
  animation?: AnimatedTile[];
  objectgroup?: Omit<Layer, "data">;
}

export interface TileSet {
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  properties: Property[];
  spacing: number;
  tileheight: number;
  tilewidth: number;
  tiles: SpecialTiles[];
}

export type Property = {
  name: string;
  type: "string" | "number";
  value: string;
};

export type ExternalTileSet = {
  firstgid: number;
  source: string;
};

export interface TMJ {
  height: number;
  layers: Layer[];
  orientation: string;
  properties: Property[];
  renderorder: string;
  tileheight: number;
  tilesets: ExternalTileSet[];
  tilewidth: number;
  version: number;
  width: number;
}
