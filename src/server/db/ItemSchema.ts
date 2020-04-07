import { mongoose } from "@colyseus/social";

export default new mongoose.Schema({
  itemId: Number,
  quantity: Number,
  tileId: Number,
});
