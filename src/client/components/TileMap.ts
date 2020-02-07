import { Component } from "ecsy";
import { ObjectTileStore } from "../utilities/TileMap/ObjectTileStore";
import { TileSet } from "types/tmj";
import * as EasyStarJs from "easystarjs";

export type TileMapTile = {
  image?: CanvasImageSource;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export class TileMap extends Component {
  tiles: TileMapTile[] = [];
  tileSets: TileSet[] = [];
  objectTileStore?: ObjectTileStore;
  width: number = 0;
  height: number = 0;
  name: string = "first";
  aStar = new EasyStarJs.js();

  constructor() {
    super();
  }
}
