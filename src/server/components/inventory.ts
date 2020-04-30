import { Schema, type } from "@colyseus/schema";

export type InventoryStateProps = Pick<
  InventoryState,
  "itemId" | "position" | "quantity" | "equipped"
>;

export default class InventoryState extends Schema {
  @type("number")
  itemId: number;

  @type("number")
  position: number;

  @type("number")
  quantity: number;

  @type("boolean")
  equipped?: boolean;

  constructor({
    itemId,
    position,
    quantity = 1,
    equipped = false,
  }: InventoryStateProps) {
    super();
    this.itemId = itemId;
    this.position = position;
    this.quantity = quantity;
    this.equipped = equipped;
  }
}
