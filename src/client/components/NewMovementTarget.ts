import { Component, Types } from "ecsy";
import { Direction } from "types/Grid";

export default class NewMovementTarget extends Component<NewMovementTarget> {
  static schema = {
    mapDir: { type: Types.String },
    targetTile: { default: 0, type: Types.Number },
  };
  targetTile: number = 0;
  mapDir?: Direction;
}
