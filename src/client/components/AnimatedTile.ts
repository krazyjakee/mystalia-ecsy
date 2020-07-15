import { Component, TagComponent, Types } from "ecsy";
import {
  AnimatedTileStore,
  AnimatedTileDrawable,
} from "types/TileMap/AnimatedTiles";

export default class AnimatedTile extends Component<AnimatedTile> {
  static schema = {
    drawables: { default: [[], []], type: Types.Array },
    tiles: { default: {}, type: Types.JSON },
  };

  drawables: Array<AnimatedTileDrawable[]> = [[], []]; // Below and above object layer
  tiles: AnimatedTileStore = {};

  reset() {
    this.tiles = {};
    this.drawables = [[], []];
  }
}

export class AnimatedTilesInitiated extends TagComponent {}
