import { Component, TagComponent } from "ecsy";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { DrawableProperties } from "types/drawable";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { TileMapProperties } from "types/TileMap/standard";
import { Direction } from "types/Grid";

type TileMapProps = {
  properties: TileMapProperties;
  tiles: DrawableProperties[];
  tileSetStore: TileSetStore;
  objectLayerIndex: number;
  objectTileStore: ObjectTileStore;
  canvasCache: HTMLCanvasElement[];
  width: number;
  height: number;
  fileName: string;
  targetTile: number | null;
};

export default class TileMap extends Component<TileMapProps> {
  properties: TileMapProperties = {};
  tiles: DrawableProperties[] = [];
  tileSetStore: TileSetStore = {};
  objectLayerIndex: number = 0;
  objectTileStore: ObjectTileStore = new ObjectTileStore();
  canvasCache: HTMLCanvasElement[] = [];
  width: number = 0;
  height: number = 0;
  fileName: string = "";
  targetTile: number | null = null;

  reset() {
    this.tiles = [];
    this.objectLayerIndex = 0;
    this.tileSetStore = {};
    this.objectTileStore = new ObjectTileStore();
    this.width = 0;
    this.height = 0;
    this.fileName = "first";
    this.targetTile = null;
    this.canvasCache = [];
    this.properties = {};
  }
}

type ChangeMapProps = {
  direction?: Direction;
};

export class ChangeMap extends Component<ChangeMapProps> {
  direction?: Direction;
}

export class ChangingMap extends TagComponent {}
