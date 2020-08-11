import config from "@client/config.json";
import React, { useState, useEffect, useContext } from "react";
import gameState from "@client/gameState";

import { Section } from "../../Section";
import { TextInput } from "@client/react/FormControls/TextInput";
import { Row, Col } from "react-flexbox-grid";
import { Label } from "@client/react/FormControls/Label";

import { validateInputNumber } from "@client/react/utilities/FormValidation";

export default ({ show = false }) => {

const [globRadius, setGlobRadius] = useState<number | undefined>();
const [globIntensity, setGlobIntensity] = useState<number | undefined>();

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
                    const result = validateInputNumber(e.currentTarget)
                    setGlobRadius(result);
                  }}
                  value={
                    globRadius
                  }
                  placeholder="Global Radius"
                  type="number"
                  min="0"
                  max="30"
                />
              </Col>
              
              <Col xs={6}>
              <Label>{"Intensity (1-100):"}</Label>
                <TextInput
                  onChange={(e) => {
                    const result = validateInputNumber(e.currentTarget)
                    setGlobIntensity(result);
                  }}
                  value={
                    globIntensity
                  }
                  placeholder="Global Intensity"
                  type="number"
                  min="0"
                  max="100"
                />
              </Col>
          </Row>
         
    </Section>
  );
};
