import { Component } from "ecsy";

type ItemProps = {
  itemId?: number;
  tileId?: number;
  sourceTileId?: number;
  quantity: number;
};

export default class Item extends Component<ItemProps> {
  itemId?: number;
  tileId?: number;
  sourceTileId?: number;
  quantity: number = 1;
}
