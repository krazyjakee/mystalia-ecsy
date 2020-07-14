import { Component } from "ecsy";

export default class Item extends Component<Item> {
  itemId?: number;
  tileId?: number;
  sourceTileId?: number;
  quantity: number = 1;
}
