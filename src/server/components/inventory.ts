import { Schema, type } from "@colyseus/schema";
import ItemState from "./item";

export default class InventoryState extends Schema {
  @type("number")
  itemId: number;

  @type("number")
  position: number;

  @type("number")
  quantity: number;

  constructor(itemId: number, position: number, quantity: number = 1) {
    super();
    this.itemId = itemId;
    this.position = position;
    this.quantity = quantity;
  }
}
