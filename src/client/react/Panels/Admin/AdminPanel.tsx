import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { PanelSection } from "../PanelSection";
import Hotkey from "../../Utilities/Hotkey";
import { TabButton } from "../../FormControls/TabButton";

export default () => {
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.addEventListener("admin:enable", () => {
      setEnabled(true);
    });
    document.addEventListener("admin:disable", () => {
      setEnabled(false);
    });
  }, []);

  return enabled ? (
    <Hotkey keys={["Backquote"]}>
      <BasePanel
        title="Admin Panel"
        rndOptions={{
          defaultWidth: 800,
          defaultHeight: 600,
          minWidth: 619
        }}
        isDraggable={true}
      >
        <Grid fluid>
          <Row>
            <Col xs={6}>
              <PanelSection>
                <TabButton
                  value="Player Management"
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                ></TabButton>
              </PanelSection>
            </Col>
            <Col xs={6}>
              <PanelSection />
            </Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  ) : null;
};
