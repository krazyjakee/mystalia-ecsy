import { Component, TagComponent } from "ecsy";
import {
  AnimatedTileStore,
  AnimatedTileDrawable
} from "types/TileMap/AnimatedTiles";

export default class AnimatedTile extends Component {
  drawables: Array<AnimatedTileDrawable[]> = [[], []]; // Below and above object layer
  tiles: AnimatedTileStore = {};
}

export class AnimatedTilesInitiated extends TagComponent {}
