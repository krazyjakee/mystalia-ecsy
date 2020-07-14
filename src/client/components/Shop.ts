import { Component } from "ecsy";
import { ObjectTile } from "types/TileMap/ObjectTileStore";

type ShopTiles = {
  [key: number]: ObjectTile<"shop">;
};

export default class Shop extends Component<Shop> {
  shopTiles: ShopTiles = {};
}

export class OpenShopAtDestination extends Component<OpenShopAtDestination> {
  shopId?: number;
}
