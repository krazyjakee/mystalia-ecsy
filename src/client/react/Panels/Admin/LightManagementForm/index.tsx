import config from "@client/config.json";
import React, { useState, useEffect, useContext } from "react";
import gameState from "@client/gameState";

import { Section } from "../../Section";
import { SubSection } from "../../SubSection";
import { TextInput } from "@client/react/FormControls/TextInput";
import { CheckBox } from "@client/react/FormControls/CheckBox";
import { Row, Col } from "react-flexbox-grid";
import { Label } from "@client/react/FormControls/Label";

export default ({ show = false }) => {

const [globRadius, setGlobRadius] = useState<string>("");
const [globIntensity, setGlobIntensity] = useState<string>("");

useEffect(() => {
    gameState.trigger("admin:globalLightSpec:update", {radius: globRadius, intensity: globIntensity});
  });

  if (!show) return null;

  return (
    <Section>
    <Label>Global Settings:</Label>
          <Row>
            <Col xs={6}>
              <Label>Radius (1-30):</Label>
                <TextInput
                  onChange={(e) => {
                    if (parseInt(e.currentTarget.value) > 30 || parseInt(e.currentTarget.value) < 1) {
                      e.preventDefault()
                      return
                    }
                    setGlobRadius(e.currentTarget.value);
                  }}
                  value={
                    globRadius
                  }
                  placeholder="Global Radius"
                />
              </Col>
              
              <Col xs={6}>
              <Label>{"Intensity (1-100):"}</Label>
                <TextInput
                  onChange={(e) => {
                    if (parseInt(e.currentTarget.value) > 100 || parseInt(e.currentTarget.value) < 1) {
                      e.preventDefault()
                      return
                    }
                    setGlobIntensity(e.currentTarget.value);
                  }}
                  value={
                    globIntensity
                  }
                  placeholder="Global Intensity"
                />
              </Col>
          </Row>
         
    </Section>
  );
};
