import React from "react";
import { BasePanel as BasePanelComponent } from "./BasePanel";
import { Section as SectionComponent } from "./Section";
import AdminPanelComponent from "./Admin/AdminPanel";
import InventoryPanelComponent from "./Inventory/InventoryPanel";
import { MapSchema } from "@colyseus/schema";

export default {
  title: "Panels"
};

export const BasePanel = () => (
  <BasePanelComponent
    title="Panel Title"
    rndOptions={{
      defaultWidth: 800,
      defaultHeight: 200
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
      quantity: 1
    },
    b: {
      itemId: 1,
      position: 1,
      quantity: 2
    },
    c: {
      itemId: -1,
      position: 2
    }
  });

  return (
    <InventoryPanelComponent forceEnable={true} propsInventoryState={items} />
  );
};
