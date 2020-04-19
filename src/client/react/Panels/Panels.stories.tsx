import React from "react";
import { BasePanel as BasePanelComponent } from "./BasePanel";
import { Section as SectionComponent } from "./Section";
import AdminPanelComponent from "./Admin/AdminPanel";
import InventoryPanelComponent from "./Inventory/InventoryPanel";
import TopMenuComponent from "./TopMenu";
import { EnemyStatus as EnemyStatusComponent } from "./EnemyStatus";
import { MapSchema } from "@colyseus/schema";

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
      itemId: -1,
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
      index: "i1",
      spec: {
        id: 1,
        name: "Wild Boar",
        spritesheet: "",
        spriteId: 0,
        behavior: {},
        speed: 0,
        maxDistance: 0,
        hp: [40, 60],
        abilities: [0],
      },
    }}
  />
);
