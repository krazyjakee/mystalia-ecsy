import { Component } from "ecsy";
import { SimpleLootItemState } from "@client/react/Panels/Loot/lootItemStateToArray";

export default class Loot extends Component {
  tileId?: number;
  items: SimpleLootItemState[] = [];
}

export class UpdateLoot extends Component {
  updates: {
    tileId?: number;
    items: SimpleLootItemState[];
  }[] = [];
}

export class OpenLootAtDestination extends Component {
  tileId?: number;
}
