import { mongoose } from "@colyseus/social";

export default new mongoose.Schema({
  enemyId: Number,
  zoneId: Number,
  currentTile: Number,
  tilePath: [Number],
  room: String,
  index: String,
  traveler: Boolean,
});
