import { InventoryStateProps } from "@server/components/inventory";

export type ItemSpec = {
  id: number;
  name: string;
  spritesheet: string;
  spriteId: number;
};

export type InventoryItems = InventoryStateProps & Omit<ItemSpec, "id">;
