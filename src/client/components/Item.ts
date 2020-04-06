import { Component } from "ecsy";

export default class Item extends Component {
  itemId?: number;
  tileId?: number;
  sourceTileId?: number;
  quantity: number = 1;
}
