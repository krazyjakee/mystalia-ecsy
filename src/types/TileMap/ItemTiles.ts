import { InventoryStateProps } from "@server/components/inventory";

export type ItemType = "cast" | "melee" | "shield" | "consumable" | "other";

export type ItemTags = "wood" | "strength" | "magic";

export type ItemSpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
  type?: ItemType;
  equippable?: boolean;
  tags?: ItemTags[];
  damage?: [number, number];
  effect?: number;
  range?: number;
};

export type InventoryItems = InventoryStateProps & Omit<ItemSpec, "id">;
