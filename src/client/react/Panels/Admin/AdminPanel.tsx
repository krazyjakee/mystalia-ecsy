import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { PanelSection } from "../PanelSection";
import Hotkey from "../../Utilities/Hotkey";
import { TabButton } from "../../FormControls/TabButton";
import Select from "../../FormControls/Select";
import gameState from "../../../gameState";
import { useGameEvent } from "../../Hooks/useGameEvent";

type Props = {
  forceEnable?: boolean;
};

export default ({ forceEnable }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [enabled, setEnabled] = useState(forceEnable || false);
  const [allPlayersResponse] = useGameEvent("admin:list:allPlayers");

  const playerList = allPlayersResponse && allPlayersResponse.all;

  useEffect(() => {
    gameState.subscribe("admin:enable", () => {
      setEnabled(true);
      gameState.sendRoom("admin", "admin:list:allPlayers");
    });
    gameState.subscribe("admin:disable", () => setEnabled(false));
  }, [allPlayersResponse]);

  return enabled ? (
    <Hotkey keys={["Backquote"]} show={forceEnable}>
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
            <Col>
              <PanelSection>
                <TabButton
                  value="Player Management"
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                ></TabButton>
              </PanelSection>
            </Col>
            <Col xs={true}>
              <PanelSection>
                <Select
                  isLoading={!playerList}
                  options={
                    playerList &&
                    playerList.map(player => ({
                      label: player.displayName,
                      value: player.username
                    }))
                  }
                />
              </PanelSection>
            </Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  ) : null;
};
