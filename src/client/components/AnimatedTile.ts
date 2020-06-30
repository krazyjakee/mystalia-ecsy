import { Component, TagComponent, Types } from "ecsy";
import {
  AnimatedTileStore,
  AnimatedTileDrawable,
} from "types/TileMap/AnimatedTiles";

type AnimatedTileProps = {
  drawables: Array<AnimatedTileDrawable[]>;
  tiles: AnimatedTileStore;
};

export default class AnimatedTile extends Component<AnimatedTileProps> {
  drawables: Array<AnimatedTileDrawable[]> = [[], []];
  tiles: AnimatedTileStore = {};

  static schema = {
    drawables: { default: [[], []], type: Types.Array },
    tiles: { default: {}, type: Types.JSON },
  };
}

export class AnimatedTilesInitiated extends TagComponent {}
