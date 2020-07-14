import { Component } from "ecsy";
import { SimpleLootItemState } from "@client/react/Panels/Loot/lootItemStateToArray";

export default class Loot extends Component<Loot> {
  tileId?: number;
  items: SimpleLootItemState[] = [];
}

export class UpdateLoot extends Component<UpdateLoot> {
  updates: {
    tileId?: number;
    items: SimpleLootItemState[];
  }[] = [];
}

export class OpenLootAtDestination extends Component<OpenLootAtDestination> {
  tileId?: number;
}
