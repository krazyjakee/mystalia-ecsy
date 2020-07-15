import { Component, Types } from "ecsy";

export default class Item extends Component<Item> {
  static schema = {
    itemId: { type: Types.Number },
    tileId: { type: Types.Number },
    sourceTileId: { type: Types.Number },
    quantity: { default: 1, type: Types.Number },
  };
  itemId?: number;
  tileId?: number;
  sourceTileId?: number;
  quantity: number = 1;
}
