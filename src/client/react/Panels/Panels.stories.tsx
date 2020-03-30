import React from "react";

import { BasePanel as BasePanelComponent } from "./BasePanel";
import { PanelSection as PanelSectionComponent } from "./PanelSection";

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

export const PanelSection = () => (
  <PanelSectionComponent style={{ height: 200 }} />
);

export const PanelWithSections = () => (
  <BasePanelComponent
    title="Panel Title With Sections"
    rndOptions={{
      defaultWidth: 800,
      defaultHeight: 200
    }}
    isDraggable={true}
  >
    <PanelSectionComponent style={{ flex: 1 }} />
    <PanelSectionComponent style={{ flex: 1 }} />
  </BasePanelComponent>
);
