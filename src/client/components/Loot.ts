import { Component, Types } from "ecsy";
import { SimpleLootItemState } from "@client/react/Panels/Loot/lootItemStateToArray";

export default class Loot extends Component<Loot> {
  static schema = {
    tileId: { type: Types.Number },
    items: { default: [], type: Types.Array },
  };
  tileId?: number;
  items: SimpleLootItemState[] = [];
}

export class UpdateLoot extends Component<UpdateLoot> {
  static schema = {
    updates: { default: [], type: Types.Array },
  };

  updates: {
    tileId?: number;
    items: SimpleLootItemState[];
  }[] = [];
}

export class OpenLootAtDestination extends Component<OpenLootAtDestination> {
  static schema = {
    updates: { type: Types.Number },
  };
  tileId?: number;
}
