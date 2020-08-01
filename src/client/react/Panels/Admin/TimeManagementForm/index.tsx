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

const [dayLengthInMinutes, setDayLengthInMinutes] = useState<number>(config.dayLengthInMinutes);
const [dayLightPercentage, setDayLightPercentage] = useState<number>(config.dayLightPercentage);
const [transitionTime, setTransitionTime] = useState<number>(config.transitionTime);

const [forceTime, setForceTime] = useState<string>("");

useEffect(() => {
    gameState.trigger("admin:forceTime:update", {forceTime: forceTime});
    gameState.trigger("admin:timeSpec:update", {dayLengthMins: dayLengthInMinutes});
    gameState.trigger("admin:timePhase:update", {dayLengthPerc: dayLightPercentage, transitionPerc: transitionTime});
  });

  if (!show) return null;

  return (
    <Section>
    <Label>Length of Day (mins):</Label>
          <Row>
            <Col xs={12}>
              <TextInput
                onChange={(e) => {
                  setDayLengthInMinutes(parseInt(e.currentTarget.value));
                }}
                value={
                  dayLengthInMinutes
                }
                placeholder="Day length minutes"
                type="number"
              />
            </Col>
          </Row>
          <Label>Force time (number):</Label>
          <Row>
            <Col xs={12}>
              <TextInput
                onChange={(e) => {
                  if (parseInt(e.currentTarget.value) > 24 || parseInt(e.currentTarget.value) < 0) {
                      e.preventDefault()
                      return
                    }
                  setForceTime(e.currentTarget.value);
                }}
                value={
                  forceTime
                }
                placeholder="e.g. 11"
              />
            </Col>
          </Row>
          <SubSection label="Modifiers">
            <Row>
              <Col xs={6}>
              <Label>Day (%):</Label>
                <TextInput
                  onChange={(e) => {
                    if (parseInt(e.currentTarget.value) > 100 || parseInt(e.currentTarget.value) < 1) {
                      e.preventDefault()
                      return
                    }
                    setDayLightPercentage(parseInt(e.currentTarget.value));
                  }}
                  value={
                    dayLightPercentage
                  }
                  placeholder="Percentage of day that is light"
                  type="number"
                />
              </Col>
              
              <Col xs={6}>
              <Label>Transition (%):</Label>
                <TextInput
                  onChange={(e) => {
                  console.log(e.target.value)
                    if (parseInt(e.currentTarget.value) > 100 || parseInt(e.currentTarget.value) < 1) {
                      e.preventDefault()
                      return
                    }
                    setTransitionTime(parseInt(e.currentTarget.value));
                  }}
                  value={
                    transitionTime
                  }
                  placeholder="Percentage of time spent transitioning"
                  type="number"
                />
              </Col>
            </Row>
          </SubSection>
    </Section>
  );
};
