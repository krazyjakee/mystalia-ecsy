import { Schema, type } from "@colyseus/schema";

export type LootItemStateProps = Pick<
  LootItemState,
  "itemId" | "position" | "quantity"
>;

export default class LootItemState extends Schema {
  @type("number")
  itemId: number;

  @type("number")
  position: number;

  @type("number")
  quantity: number;

  constructor({ itemId, position, quantity = 1 }: LootItemStateProps) {
    super();
    this.itemId = itemId;
    this.position = position;
    this.quantity = quantity;
  }
}
