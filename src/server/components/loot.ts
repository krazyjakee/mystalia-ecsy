import { Schema, type, MapSchema } from "@colyseus/schema";
import LootItemState from "./lootItem";
import { arrayToMapSchema } from "@server/utilities/colyseusState";

export default class LootState extends Schema {
  @type("number")
  lootId: number;

  @type({ map: LootItemState })
  items: MapSchema<LootItemState>;

  @type("number")
  tileId: number;

  constructor(id: number, tileId: number, items: LootItemState[]) {
    super();
    this.lootId = id;
    this.tileId = tileId;
    this.items = arrayToMapSchema(items, LootItemState);
  }
}
