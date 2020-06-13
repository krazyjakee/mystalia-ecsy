import { mongoose } from "@colyseus/social";

const LootItem = new mongoose.Schema({
  itemId: Number,
  quantity: Number,
  position: Number,
});

export default new mongoose.Schema({
  lootId: Number,
  items: [LootItem],
  tileId: Number,
  countdown: Number, // TODO: Replace with "expires" and add a migration to remove this data and add the new column.
  room: String,
  index: String,
});
