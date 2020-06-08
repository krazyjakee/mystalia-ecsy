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
  countdown: Number,
  room: String,
  index: String,
});
