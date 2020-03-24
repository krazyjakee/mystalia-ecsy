import { ObjectTileTypeString } from "./TileMap/ObjectTileStore";

interface Attributes {
  height: number;
  name: string;
  properties: Property[];
  rotation: number;
  type: ObjectTileTypeString;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export type LayerType = "tilelayer" | "objectlayer";

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
  animation: AnimatedTile[];
}

export interface TileSet {
  firstgid: number;
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

export interface TMJ {
  height: number;
  layers: Layer[];
  orientation: string;
  properties: Property[];
  renderorder: string;
  tileheight: number;
  tilesets: TileSet[];
  tilewidth: number;
  version: number;
  width: number;
}
