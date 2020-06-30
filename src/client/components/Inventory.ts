import { Component } from "ecsy";
import { InventoryItems } from "types/TileMap/ItemTiles";

type IntentoryProps = {
  inventory: InventoryItems[];
};

export default class Inventory extends Component<IntentoryProps> {
  inventory: InventoryItems[] = [];
}
