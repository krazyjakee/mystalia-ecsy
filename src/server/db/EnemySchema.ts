import { mongoose } from "@colyseus/social";

export default new mongoose.Schema({
  enemyId: Number,
  zoneId: Number,
  currentTile: Number,
  room: String,
  index: String
});
