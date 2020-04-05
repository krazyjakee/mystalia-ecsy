import { Schema, type } from "@colyseus/schema";

export default class ItemState extends Schema {
  @type("number")
  itemId: number;

  @type("number")
  quantity: number;

  @type("number")
  tileId: number;

  constructor(id: number, tileId: number, quantity?: number) {
    super();
    this.itemId = id;
    this.tileId = tileId;
    this.quantity = quantity || 1;
  }
}
