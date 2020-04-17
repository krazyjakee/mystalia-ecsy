import { mongoose } from "@colyseus/social";

export default new mongoose.Schema({
  biome: String,
  weathers: [String],
  duration: Number,
});
