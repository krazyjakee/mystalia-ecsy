import config from "@client/config.json";
import React, { useState, useEffect } from "react";
import gameState from "@client/gameState";
import Storage from "@client/utilities/storage";

import { Section } from "../../Section";
import { SubSection } from "../../SubSection";
import { TextInput } from "@client/react/FormControls/TextInput";
import { CheckBox } from "@client/react/FormControls/CheckBox";
import { Row, Col } from "react-flexbox-grid";
import { Label } from "@client/react/FormControls/Label";
import { Button } from "@client/react/FormControls/Button";

import { validateInputNumber } from "@client/react/Utilities/FormValidation";

export default ({ show = false }) => {

const localTSpec = Storage.getAdmin("timeSpec:update")
const [dayLengthInMinutes, setDayLengthInMinutes] = useState<number | undefined>(localTSpec.dayLengthMins || config.time.dayLengthInMinutes);

const localTPhase = Storage.getAdmin("timePhase:update")
const [dayLightPercentage, setDayLightPercentage] = useState<number | undefined>(localTPhase.dayLengthPerc || config.time.dayLightPercentage);
const [transitionTime, setTransitionTime] = useState<number | undefined>(localTPhase.transitionPerc || config.time.transitionTime);

const localTime = Storage.getAdmin("forceTime:update")

const [forceHours, setForceHours] = useState<number | undefined>(localTime.hours || 0);
const [forceMins, setForceMins] = useState<number | undefined>(localTime.minutes || 0);
const [forceTimeActive, setForceTimeActive] = useState<boolean>(localTime.active || false);

useEffect(() => {
    gameState.trigger("admin:forceTime:update", {hours: forceHours, minutes: forceMins, active: forceTimeActive});
    gameState.trigger("admin:timeSpec:update", {dayLengthMins: dayLengthInMinutes});
    gameState.trigger("admin:timePhase:update", {dayLengthPerc: dayLightPercentage, transitionPerc: transitionTime});
  });

  if (!show) return null;

  return (
    <Section>
    
          <Label>Time overide (24hrs):</Label>
          <Row>

            <Col xs={6}>
              <TextInput
                onChange={(e) => {
                    const result = validateInputNumber(e.currentTarget)
                    setForceHours(result);
                    Storage.setAdmin("forceTime:update", {"hours": result, "minutes": forceMins, "active": forceTimeActive})
                }}
                value={
                  forceHours
                }
                placeholder="Hours e.g. 23"
                type="number"
                min="0"
                max="24"
              />
            </Col>
          
            <Col xs={6}>
              <TextInput
                onChange={(e) => {
                    const result = validateInputNumber(e.currentTarget)
                    setForceMins(result);
                    Storage.setAdmin("forceTime:update", {"hours": forceHours, "minutes": result, "active": forceTimeActive})
                }}
                value={
                  forceMins
                }
                placeholder="Mins e.g. 55"
                type="number"
                min="0"
                max="60"
              />
            </Col>
          </Row>
          <CheckBox
            checked={forceTimeActive}
            label="Time overide enabled?"
            onClick={(checked) => {
               setForceTimeActive(checked);
               Storage.setAdmin("forceTime:update", {"hours": forceHours, "minutes": forceMins, "active": checked})
            }}
          />
          <SubSection label="Modifiers">
            <Label>Length of Day (mins):</Label>
            <Row>
              <Col xs={12}>
                <TextInput
                  onChange={(e) => {
                      const result = validateInputNumber(e.currentTarget)
                      setDayLengthInMinutes(result);
                      Storage.setAdmin("timeSpec:update", {"dayLengthMins": result})
                  }} 
                  value={
                    dayLengthInMinutes
                  }
                  placeholder="Day length minutes"
                  type="number"
                  min="0"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
              <Label>Day (%):</Label>
                <TextInput
                  onChange={(e) => {
                      const result = validateInputNumber(e.currentTarget)
                      setDayLightPercentage(result);
                      Storage.setAdmin("timePhase:update", {"dayLengthPerc": result})
                  }}
                  value={
                    dayLightPercentage
                  }
                  placeholder="Percentage of day that is light"
                  type="number"
                  min="0"
                  max="100"
                />
              </Col>
              
              <Col xs={6}>
              <Label>Transition (%):</Label>
              <TextInput
                  onChange={(e) => {
                      const result = validateInputNumber(e.currentTarget)
                      setTransitionTime(result);
                      Storage.setAdmin("timePhase:update", {"transitionTime": result})
                  }}
                  value={
                    transitionTime
                  }
                  placeholder="Percentage of day that is light"
                  type="number"
                  min="0"
                  max="100"
                />
               
              </Col>
            </Row>
          </SubSection>
          <Label>Admin Local Storage</Label>
          <Row>
           <Col xs={6}>
            <Button
                value="Reset Time overide"
                onClick={() => {
                  Storage.setAdmin("forceTime:update")
                  setForceTimeActive(false);
                  setForceHours(undefined);
                  setForceMins(undefined);
                  }
                }
              />
              </Col>
             <Col xs={6}>
            <Button
              value="Reset Modifiers"
              onClick={() => {
                Storage.setAdmin("timePhase:update");
                Storage.setAdmin("timeSpec:update");
                setDayLengthInMinutes(config.time.dayLengthInMinutes);
                setDayLightPercentage(config.time.dayLightPercentage);
                setTransitionTime(config.time.transitionTime);
                }
              }
            />
            </Col>
          </Row>
    </Section>
  );
};
