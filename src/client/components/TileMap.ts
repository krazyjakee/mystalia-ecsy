import { Component } from "ecsy";
import { ObjectTileStore } from "utilities/ObjectTileStore";
import * as EasyStarJs from "easystarjs";
import { DrawableProperties } from "types/drawable";
import { TileSetStore } from "types/TileMap/TileSetStore";
import { TileMapProperties } from "types/TileMap/standard";

export default class TileMap extends Component {
  properties: TileMapProperties = {};
  tiles: DrawableProperties[] = [];
  tileSetStore: TileSetStore = {};
  objectLayerIndex: number = 0;
  objectTileStore: ObjectTileStore = new ObjectTileStore();
  canvasCache: HTMLCanvasElement[] = [];
  width: number = 0;
  height: number = 0;
  name: string = "";
  targetTile: number | null = null;
  aStar = new EasyStarJs.js();

  reset() {
    this.tiles = [];
    this.objectLayerIndex = 0;
    this.tileSetStore = {};
    this.objectTileStore = new ObjectTileStore();
    this.width = 0;
    this.height = 0;
    this.name = "";
    this.targetTile = null;
    this.canvasCache = [];
    this.properties = {};
    this.aStar = new EasyStarJs.js();
  }
}
