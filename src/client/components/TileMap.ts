import { Component } from "ecsy";
import { ObjectTileStore } from "../utilities/TileMap/ObjectTileStore";
import * as EasyStarJs from "easystarjs";
import { DrawableProperties } from "types/drawable";
import { TileSetStore } from "types/TileMap/TileSetStore";

export default class TileMap extends Component {
  loaded: boolean = false;
  tiles: DrawableProperties[] = [];
  tileSetStore: TileSetStore = {};
  objectLayerIndex: number = 0;
  objectTileStore?: ObjectTileStore;
  canvasCache: HTMLCanvasElement[] = [];
  width: number = 0;
  height: number = 0;
  name: string = "";
  aStar = new EasyStarJs.js();

  constructor() {
    super();
  }

  reset() {
    this.tiles = [];
    this.tileSetStore = {};
    this.objectTileStore = undefined;
    this.width = 0;
    this.height = 0;
    this.name = "";
  }
}
