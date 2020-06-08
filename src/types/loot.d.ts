type LootItem = {
  itemId: number;
  chance: number;
  quantity: [number, number];
};

type LootSpec = {
  id: number;
  name: string;
  items: LootItem[];
  daysToRespawn: number;
  requiredItem?: number;
};
