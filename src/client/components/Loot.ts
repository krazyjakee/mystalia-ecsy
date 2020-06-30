import { Component } from "ecsy";
import { SimpleLootItemState } from "@client/react/Panels/Loot/lootItemStateToArray";

type LootProps = {
  tileId?: number;
  items: SimpleLootItemState[];
};

export default class Loot extends Component<LootProps> {
  tileId?: number;
  items: SimpleLootItemState[] = [];
}

type UpdateLootProps = {
  updates: LootProps[];
};

export class UpdateLoot extends Component<UpdateLootProps> {
  updates: LootProps[] = [];
}

type OpenLootAtDestinationProps = {
  tileId?: number;
};

export class OpenLootAtDestination extends Component<
  OpenLootAtDestinationProps
> {
  tileId?: number;
}
