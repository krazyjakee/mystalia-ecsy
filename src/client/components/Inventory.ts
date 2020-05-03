import { Component } from "ecsy";
import { InventoryItems } from "types/TileMap/ItemTiles";

export default class Inventory extends Component {
  inventory: InventoryItems[] = [];
}
