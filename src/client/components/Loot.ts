import { Component } from "ecsy";
import LootItemState from "@server/components/lootItem";

export default class Loot extends Component {
  tileId?: number;
  items: Pick<LootItemState, "itemId" | "position" | "quantity">[] = [];
}

export class UpdateLoot extends Component {
  tileId?: number;
  items: Pick<LootItemState, "itemId" | "position" | "quantity">[] = [];
}

export class OpenLootAtDestination extends Component {
  tileId?: number;
}
