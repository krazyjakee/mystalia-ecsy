import { Component } from "ecsy";
import { ObjectTile } from "types/TileMap/ObjectTileStore";

type ShopTiles = {
  [key: number]: ObjectTile<"shop">;
};

export default class Shop extends Component {
  shopTiles: ShopTiles = {};
}

export class OpenShopAtDestination extends Component {
  shopId?: number;
}
