import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { Section } from "../Section";
import Hotkey from "../../Utilities/Hotkey";
import { TabButton } from "../../FormControls/TabButton";
import gameState from "../../../gameState";
import PlayerManagementForm from "./PlayerManagementForm";
import ItemManagementForm from "./ItemManagementForm";
import TimeManagementForm from "./TimeManagementForm";
import LightManagementForm from "./LightManagementForm";

type Props = {
  forceShow?: boolean;
};

export default ({ forceShow }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(forceShow || false);

  useEffect(() => {
    gameState.subscribe("admin:enable", () => setEnabled(true));
    gameState.subscribe("admin:disable", () => setEnabled(false));
  }, []);

  return enabled ? (
    <Hotkey keys={["Backquote"]} show={forceShow}>
      <BasePanel
        title="Admin Panel"
        rndOptions={{
          defaultWidth: 800,
          defaultHeight: 600,
          minWidth: 619,
        }}
        isDraggable={true}
        onCloseClick={() => setEnabled(false)}
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
                <br />
                <TabButton
                  value="Item Management"
                  active={activeTab === 1}
                  onClick={() => setActiveTab(1)}
                ></TabButton>
                <br />
                <TabButton
                  value="Time Machine"
                  active={activeTab === 2}
                  onClick={() => setActiveTab(2)}
                ></TabButton>
                <br />
                <TabButton
                  value="Lighting Settings"
                  active={activeTab === 3}
                  onClick={() => setActiveTab(3)}
                ></TabButton>
              </Section>
            </Col>
            <Col xs={true}>
              <PlayerManagementForm show={activeTab === 0} />
              <ItemManagementForm show={activeTab === 1} />
              <TimeManagementForm show={activeTab === 2} />
              <LightManagementForm show={activeTab === 3} />
            </Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  ) : null;
};
