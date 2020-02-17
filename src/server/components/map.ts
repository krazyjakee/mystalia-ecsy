import { Schema, MapSchema, type } from "@colyseus/schema";
import PlayerState from "./player";

export default class MapState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();
}
