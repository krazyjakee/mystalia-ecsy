import React from "react";
import { BasePanel as BasePanelComponent } from "./BasePanel";
import { Section as SectionComponent } from "./Section";
import AdminPanelComponent from "./Admin/AdminPanel";
import InventoryPanelComponent from "./Inventory/InventoryPanel";

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

export const InventoryPanel = () => (
  <InventoryPanelComponent forceEnable={true} />
);
