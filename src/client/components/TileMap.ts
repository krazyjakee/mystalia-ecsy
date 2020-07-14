import { Component, TagComponent, Types } from "ecsy";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import { DrawableProperties } from "types/drawable";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { TileMapProperties } from "types/TileMap/standard";
import { Direction } from "types/Grid";

export default class TileMap extends Component<TileMap> {
  static schema = {
    properties: { default: {}, type: Types.JSON },
    tiles: { default: [], type: Types.Array },
    tileSetStore: { default: {}, type: Types.JSON },
    objectLayerIndex: { default: 0, type: Types.Number },
    objectTileStore: { default: new ObjectTileStore(), type: Types.JSON },
    canvasCache: { default: [], type: Types.Array },
    width: { default: 0, type: Types.Number },
    height: { default: 0, type: Types.Number },
    fileName: { default: "", type: Types.String },
    targetTile: { default: null, type: Types.Number },
  };

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

export class ChangeMap extends Component<ChangeMap> {
  static schema = {
    direction: { type: Types.String },
  };
  direction?: Direction;
}

export class ChangingMap extends TagComponent {}
