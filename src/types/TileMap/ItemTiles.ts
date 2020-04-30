import { InventoryStateProps } from "@server/components/inventory";

export type ItemClass = "cast" | "melee" | "shield" | "consumable" | "other";

export type ItemTags = "wood" | "string";

export type ItemSpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
  class?: ItemClass;
  equippable?: boolean;
  tags?: ItemTags[];
  damage?: [number, number];
};

export type InventoryItems = InventoryStateProps & Omit<ItemSpec, "id">;
