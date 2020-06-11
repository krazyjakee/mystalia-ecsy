export type LootItem = {
  itemId: number;
  chance: number;
  quantity: [number, number];
};

export type LootSpec = {
  id: number;
  name: string;
  items: LootItem[];
  daysToRespawn: number;
  requiredItem?: number;
};
