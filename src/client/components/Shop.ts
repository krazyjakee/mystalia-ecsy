import { Component, Types } from "ecsy";
import { ObjectTile } from "types/TileMap/ObjectTileStore";

type ShopTiles = {
  [key: number]: ObjectTile<"shop">;
};

export default class Shop extends Component<Shop> {
  static schema = {
    shopTiles: { default: {}, type: Types.JSON },
  };
  shopTiles: ShopTiles = {};
}

export class OpenShopAtDestination extends Component<OpenShopAtDestination> {
  static schema = {
    shopTiles: { type: Types.Number },
  };
  shopId?: number;
}
