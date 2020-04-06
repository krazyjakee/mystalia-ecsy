import { Schema, type } from "@colyseus/schema";

export type InventoryStateProps = Pick<
  InventoryState,
  "itemId" | "position" | "quantity"
>;

export default class InventoryState extends Schema {
  @type("number")
  itemId: number;

  @type("number")
  position: number;

  @type("number")
  quantity: number;

  constructor({ itemId, position, quantity = 1 }: InventoryStateProps) {
    super();
    this.itemId = itemId;
    this.position = position;
    this.quantity = quantity;
  }
}
