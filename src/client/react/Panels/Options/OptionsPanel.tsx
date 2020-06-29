import React, { useState } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { Section } from "../Section";
import { TabButton } from "../../FormControls/TabButton";
import { createUseStyles } from "react-jss";
import Hotkey from "@client/react/Utilities/Hotkey";
import { triggerGlobalKeypress } from "utilities/input";

const useStyles = createUseStyles({
  root: {
    margin: "75px auto",
    width: 800,
    height: 600,
  },
});

type Props = {
  forceShow?: boolean;
};

export default ({ forceShow }: Props) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Hotkey
      keys={["KeyT"]}
      show={forceShow}
      onShow={() => (window.disableMovement = true)}
      onHide={() => (window.disableMovement = false)}
    >
      <BasePanel
        className={classes.root}
        title="Options"
        onCloseClick={() => triggerGlobalKeypress("T")}
      >
        <Grid fluid>
          <Row>
            <Col>
              <Section>
                <TabButton
                  value="Sound Options"
                  active={activeTab === 0}
                  onClick={() => setActiveTab(0)}
                ></TabButton>
              </Section>
            </Col>
            <Col xs={true}></Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  );
};
