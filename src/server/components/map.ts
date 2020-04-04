import { Schema, MapSchema, type } from "@colyseus/schema";
import PlayerState from "./player";
import ItemState from "./item";

export default class MapState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  @type({ map: ItemState })
  items = new MapSchema<ItemState>();
}
