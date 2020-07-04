export type CraftableSpec = {
  id: number;
  requiredItems: number[];
  ingredients: {
    itemId: number;
    quantity: number;
  }[];
  item: number;
};
