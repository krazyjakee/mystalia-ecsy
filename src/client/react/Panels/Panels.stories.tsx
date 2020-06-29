import React from "react";
import { BasePanel as BasePanelComponent } from "./BasePanel";
import { Section as SectionComponent } from "./Section";
import AdminPanelComponent from "./Admin/AdminPanel";
import InventoryPanelComponent from "./Inventory/InventoryPanel";
import TopMenuComponent from "./TopMenu";
import { EnemyStatus as EnemyStatusComponent } from "./EnemyStatus";
import ChatPanelComponent from "./Chat/ChatPanel";
import { Status as StatusComponent } from "./Status";
import ShopPanelComponent from "./Shop/ShopPanel";
import LootPanelComponent from "./Loot";
import GameMenuComponent from "./GameMenu";
import { MapSchema } from "@colyseus/schema";
import LootItemState from "@server/components/lootItem";
import OptionsPanelComponent from "./Options/OptionsPanel";

export default {
  title: "Panels",
};

export const BasePanel = () => (
  <BasePanelComponent
    title="Panel Title"
    rndOptions={{
      defaultWidth: 800,
      defaultHeight: 200,
    }}
    isDraggable={true}
  />
);

export const PanelSection = () => <SectionComponent style={{ height: 200 }} />;

export const AdminPanel = () => <AdminPanelComponent forceEnable={true} />;

export const InventoryPanel = () => {
  const items = new MapSchema({
    a: {
      itemId: 0,
      position: 0,
      quantity: 1,
    },
    b: {
      itemId: 1,
      position: 1,
      quantity: 2,
    },
    c: {
      itemId: 3,
      equipped: true,
      position: 2,
    },
  });

  return (
    <InventoryPanelComponent forceEnable={true} propsInventoryState={items} />
  );
};

export const TopMenu = () => <TopMenuComponent />;

export const EnemyStatus = () => (
  <EnemyStatusComponent
    enemy={{
      key: "i1",
      enemySpec: {
        id: 1,
        name: "Wild Boar",
        portrait: "wild-boar",
        spritesheet: "",
        spriteId: 0,
        behavior: {},
        speed: 0,
        maxDistance: 0,
        hp: 40,
        abilities: [0],
      },
      // @ts-ignore
      enemyState: { enemyId: 0 },
    }}
  />
);

export const Status = () => (
  <>
    <StatusComponent name="Player 1" large={true} portrait="wild-boar" />
    <div style={{ height: 170 }} />
    <StatusComponent name="Player 2" portrait="freshwater-perch" />
  </>
);

export const ShopPanel = () => (
  <ShopPanelComponent
    forceEnable={true}
    shop={{
      id: 0,
      name: "Polegreen Inn",
      trades: [
        {
          sell: 2,
          sellAmount: 1,
          buy: 0,
          buyAmount: 15,
        },
      ],
    }}
  />
);

export const ChatPanel = () => <ChatPanelComponent mapName="test" />;

export const LootPanel = () => {
  const lootState = [
    new LootItemState({ itemId: 0, position: 0, quantity: 1 }),
    new LootItemState({ itemId: 0, position: 1, quantity: 3 }),
  ];

  return <LootPanelComponent forceEnable={true} propsLootState={lootState} />;
};

export const GameMenu = () => (
  <GameMenuComponent logout={() => false} forceEnable={true} />
);

export const OptionsPanel = () => <OptionsPanelComponent forceShow={true} />;
