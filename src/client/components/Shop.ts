import { Component } from "ecsy";
import { ObjectTile } from "types/TileMap/ObjectTileStore";

type ShopTiles = {
  [key: number]: ObjectTile<"shop">;
};

type ShopProps = {
  shopTiles: ShopTiles;
};

export default class Shop extends Component<ShopProps> {
  shopTiles: ShopTiles = {};
}

type OpenShopAtDestinationProps = {
  shopId?: number;
};

export class OpenShopAtDestination extends Component<
  OpenShopAtDestinationProps
> {
  shopId?: number;
}
