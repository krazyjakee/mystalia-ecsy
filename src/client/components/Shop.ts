import { Component } from "ecsy";

type ShopTiles = {
  [key: number]: number;
};

export default class Shop extends Component {
  shopTiles: ShopTiles = {};
}
