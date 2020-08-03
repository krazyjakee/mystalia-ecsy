import config from "@client/config.json";
import React, { useState, useEffect, useContext } from "react";
import gameState from "@client/gameState";
import Storage from "@client/utilities/storage";

import { Section } from "../../Section";
import { SubSection } from "../../SubSection";
import { TextInput } from "@client/react/FormControls/TextInput";
import { CheckBox } from "@client/react/FormControls/CheckBox";
import { Row, Col } from "react-flexbox-grid";
import { Label } from "@client/react/FormControls/Label";
import { Button } from "@client/react/FormControls/Button";

export default ({ show = false }) => {

const localTSpec = Storage.getAdmin("timeSpec:update")
const [dayLengthInMinutes, setDayLengthInMinutes] = useState<number>(localTSpec.dayLengthMins || config.dayLengthInMinutes);

const localTPhase = Storage.getAdmin("timePhase:update")
const [dayLightPercentage, setDayLightPercentage] = useState<number>(localTPhase.dayLengthPerc || config.dayLightPercentage);
const [transitionTime, setTransitionTime] = useState<number>(localTPhase.transitionPerc || config.transitionTime);

const localTime = Storage.getAdmin("forceTime:update")

const [forceTime, setForceTime] = useState<string>(localTime.forceTime || "");
const [forceMins, setForceMins] = useState<string>(localTime.forceMins || "");

useEffect(() => {
    gameState.trigger("admin:forceTime:update", {forceTime: forceTime, forceMins: forceMins});
    gameState.trigger("admin:timeSpec:update", {dayLengthMins: dayLengthInMinutes});
    gameState.trigger("admin:timePhase:update", {dayLengthPerc: dayLightPercentage, transitionPerc: transitionTime});
  });

  if (!show) return null;

  return (
    <Section>
    
          <Label>Forced time (24hrs):</Label>
          <Row>

            <Col xs={6}>
              <TextInput
                onChange={(e) => {
                  if (parseInt(e.currentTarget.value) > 24 || parseInt(e.currentTarget.value) < 0) {
                      e.preventDefault()
                      return
                    }
                  setForceTime(e.currentTarget.value);
                  Storage.setAdmin("forceTime:update", {'forceTime': e.currentTarget.value, 'forceMins': forceMins})
                }}
                value={
                  forceTime
                }
                placeholder="Hours e.g. 23"
              />
            </Col>
          
            <Col xs={6}>
              <TextInput
                onChange={(e) => {
                  if (parseInt(e.currentTarget.value) > 60 || parseInt(e.currentTarget.value) < 0) {
                      e.preventDefault()
                      return
                    }
                  setForceMins(e.currentTarget.value);
                  Storage.setAdmin("forceTime:update", {'forceTime': forceTime, 'forceMins': e.currentTarget.value})
                }}
                value={
                  forceMins
                }
                placeholder="Mins e.g. 55"
              />
            </Col>
          </Row>
          <SubSection label="Modifiers">
            <Label>Length of Day (mins):</Label>
            <Row>
              <Col xs={12}>
                <TextInput
                  onChange={(e) => {
                    setDayLengthInMinutes(parseInt(e.currentTarget.value));
                    Storage.setAdmin("timeSpec:update", {'dayLengthMins': e.currentTarget.value})
                  }} 
                  value={
                    dayLengthInMinutes
                  }
                  placeholder="Day length minutes"
                  type="number"
                />
              </Col>
            </Row>
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
                    Storage.setAdmin("timePhase:update", {'dayLengthPerc': e.currentTarget.value})
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
                    if (parseInt(e.currentTarget.value) > 100 || parseInt(e.currentTarget.value) < 1) {
                      e.preventDefault()
                      return
                    }
                    setTransitionTime(parseInt(e.currentTarget.value));
                    Storage.setAdmin("timePhase:update", {'transitionPerc': e.currentTarget.value})
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
          <Label>Admin Local Storage</Label>
          <Row>
           <Col xs={6}>
            <Button
                value="Clear Forced Time"
                onClick={() => {
                  Storage.setAdmin("forceTime:update")
                  setForceTime("");
                  setForceMins("");
                  }
                }
              />
              </Col>
             <Col xs={6}>
            <Button
              value="Clear Modifiers"
              onClick={() => {
                Storage.setAdmin("timePhase:update");
                Storage.setAdmin("timeSpec:update");
                setDayLengthInMinutes(config.dayLengthInMinutes);
                setDayLightPercentage(config.dayLightPercentage);
                setTransitionTime(config.transitionTime);
                }
              }
            />
            </Col>
          </Row>
    </Section>
  );
};
