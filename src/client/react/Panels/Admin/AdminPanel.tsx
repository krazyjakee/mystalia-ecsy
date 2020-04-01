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
  const [allPlayers] = useGameEvent("admin:list:allPlayers");
  const [allMaps] = useGameEvent("admin:list:allMaps");

  useEffect(() => {
    gameState.subscribe("admin:enable", () => {
      setEnabled(true);
    });
    gameState.subscribe("admin:disable", () => setEnabled(false));
  }, [allPlayers, allMaps]);

  const onShow = () => {
    gameState.send("admin", "admin:list:requestAllPlayers");
    gameState.send("admin", "admin:list:requestAllMaps");
  };

  return enabled ? (
    <Hotkey keys={["Backquote"]} show={forceEnable} onShow={onShow}>
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
                  placeholder="Select Player"
                  isLoading={!allPlayers}
                  options={
                    allPlayers &&
                    allPlayers.all.map(player => ({
                      label: player.displayName,
                      value: player.username
                    }))
                  }
                />
                <Select
                  placeholder="Select Map"
                  isLoading={!allMaps}
                  options={
                    allMaps &&
                    allMaps.all.map(map => ({
                      label: map,
                      value: map
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
