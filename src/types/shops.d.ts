export type TradeSpec = {
  sell: number;
  sellAmount: number;
  buy: number;
  buyAmount: number;
};

export type ShopSpec = {
  id: number;
  name: string;
  trades: TradeSpec[];
};
