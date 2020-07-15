import { Component, Types } from "ecsy";
import { InventoryItems } from "types/TileMap/ItemTiles";

export default class Inventory extends Component<Inventory> {
  static schema = {
    inventory: { default: [], type: Types.Array },
  };
  inventory: InventoryItems[] = [];
}
