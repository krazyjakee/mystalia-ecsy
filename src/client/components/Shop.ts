import { Component } from "ecsy";

type ShopTiles = {
  [key: number]: number;
};

export default class Shop extends Component {
  shopTiles: ShopTiles = {};
}

export class OpenShopAtDestination extends Component {
  shopId?: number;
}
