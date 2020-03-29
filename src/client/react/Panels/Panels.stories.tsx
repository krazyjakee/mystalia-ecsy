import React from "react";

import { BasePanel as BasePanelComponent } from "./BasePanel";
import { PanelSection as PanelSectionComponent } from "./PanelSection";

export default {
  title: "Panels"
};

export const BasePanel = () => <BasePanelComponent title="Panel Title" />;

export const PanelSection = () => (
  <PanelSectionComponent style={{ height: 600 }} />
);

export const PanelWithSections = () => (
  <BasePanelComponent title="Panel Title With Sections" style={{ width: 800 }}>
    <PanelSectionComponent style={{ flex: 1 }} />
    <PanelSectionComponent style={{ flex: 1 }} />
  </BasePanelComponent>
);
