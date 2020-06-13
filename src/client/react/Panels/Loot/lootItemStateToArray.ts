import { MapSchema } from "@colyseus/schema";
import LootItemState from "@server/components/lootItem";

export type SimpleLootItemState = Pick<
  LootItemState,
  "itemId" | "position" | "quantity"
>;

export default (lootItemState?: MapSchema<LootItemState>) => {
  const lootItems: SimpleLootItemState[] = [];

  if (lootItemState) {
    for (let key in lootItemState) {
      const item = lootItemState[key] as LootItemState;
      const { itemId, position, quantity } = item;

      lootItems[position] = {
        itemId,
        position,
        quantity,
      };
    }
  }
  return lootItems;
};
