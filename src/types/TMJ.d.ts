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

export type LayerType = "tileLayer" | "objectLayer";

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
