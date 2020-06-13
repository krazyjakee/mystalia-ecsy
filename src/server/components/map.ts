import { Schema, MapSchema, type } from "@colyseus/schema";
import PlayerState from "./player";
import ItemState from "./item";
import EnemyState from "./enemy";
import WeatherState from "./weather";
import LootState from "./loot";

export default class MapState extends Schema {
  @type({ map: PlayerState })
  players = new MapSchema<PlayerState>();

  @type({ map: ItemState })
  items = new MapSchema<ItemState>();

  @type({ map: EnemyState })
  enemies = new MapSchema<EnemyState>();

  @type({ map: WeatherState })
  weather = new MapSchema<WeatherState>();

  @type({ map: LootState })
  loot = new MapSchema<LootState>();
}
