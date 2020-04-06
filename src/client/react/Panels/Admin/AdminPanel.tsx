import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { Section } from "../Section";
import Hotkey from "../../Utilities/Hotkey";
import { TabButton } from "../../FormControls/TabButton";
import gameState from "../../../gameState";
import PlayerManagementForm from "./PlayerManagementForm";

type Props = {
  forceEnable?: boolean;
};

export default ({ forceEnable }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(forceEnable || false);

  useEffect(() => {
    gameState.subscribe("admin:enable", () => setEnabled(true));
    gameState.subscribe("admin:disable", () => setEnabled(false));
  }, []);

  return enabled ? (
    <Hotkey keys={["Backquote"]} show={forceEnable}>
      <BasePanel
        title="Admin Panel"
        rndOptions={{
          defaultWidth: 800,
          defaultHeight: 600,
          minWidth: 619,
        }}
        isDraggable={true}
      >
        <Grid fluid>
          <Row>
            <Col>
              <Section>
                <TabButton
                  value="Player Management"
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                ></TabButton>
              </Section>
            </Col>
            <Col xs={true}>
              <PlayerManagementForm />
            </Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  ) : null;
};
