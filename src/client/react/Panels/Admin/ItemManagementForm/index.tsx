import { Section } from "../../Section";
import React, { useState, useEffect } from "react";
import { ItemSpec, ItemType, ItemTags } from "types/TileMap/ItemTiles";
import Select, { SelectValue } from "@client/react/FormControls/Select";
import Sprite from "@client/react/Utilities/Sprite";
import { TextInput } from "@client/react/FormControls/TextInput";
import { CheckBox } from "@client/react/FormControls/CheckBox";
import { Row, Col } from "react-flexbox-grid";
import { EffectSpec } from "utilities/effect";
import { isPresent } from "utilities/guards";
import { Label } from "@client/react/FormControls/Label";
import { Button } from "@client/react/FormControls/Button";
import gameState from "@client/gameState";
import { RoomMessage } from "types/gameState";

const itemSpecs = require("utilities/data/items.json") as ItemSpec[];
const effectSpecs = require("utilities/data/effects.json") as EffectSpec[];

export const SelectedUser = React.createContext<string | null>("selectedUser");

export default ({ show = false }) => {
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);

  const options = itemSpecs.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const getItemSpec = (id = 0) => {
    return itemSpecs.find((spec) => spec.id === id) as ItemSpec;
  };

  const getEffectSpec = (id = 0) => {
    const spec = effectSpecs.find((spec) => spec.id === id) as EffectSpec;
    return { value: spec.id, label: spec.spritesheet };
  };

  const [customProperties, setCustomProperties] = useState<ItemSpec>(
    getItemSpec()
  );

  useEffect(() => {
    gameState.subscribe(
      "admin:itemSpec:updated",
      (update: RoomMessage<"admin:itemSpec:updated">) => {
        if (!update.result) {
          alert("items.json failed to save");
        }
        setSaving(false);
      }
    );
  }, [saving]);

  if (!show) return null;

  return (
    <Section>
      <Select
        value={options[selectedItem]}
        onChange={(e) => {
          const value = parseInt(e.value);
          setSelectedItem(value);
          setCustomProperties(getItemSpec(value));
        }}
        placeholder="Select Item"
        options={options}
      />
      {customProperties ? (
        <>
          <hr />
          <Label>Name:</Label>
          <TextInput
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                name: e.target.value,
              });
            }}
            value={customProperties.name}
            placeholder="Enter Name"
          />
          <Label>Sprite:</Label>
          <Row>
            <Col xs={1}>
              <Sprite
                spriteId={customProperties.spriteId}
                spritesheet={customProperties.spritesheet}
                spriteSize={16}
                sizeMultiplier={2}
              />
            </Col>
            <Col xs={11}>
              <TextInput
                onChange={(e) => {
                  setCustomProperties({
                    ...customProperties,
                    spriteId: parseInt(e.target.value),
                  });
                }}
                value={customProperties.spriteId}
                placeholder="Enter Tile ID"
                type="number"
              />
            </Col>
          </Row>
          <Label>Spritesheet:</Label>
          <TextInput
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                spritesheet: e.target.value,
              });
            }}
            value={customProperties.spritesheet}
            placeholder="Enter Spritesheet"
          />
          <Label>Type:</Label>
          <Select
            value={{
              label: customProperties.type,
              value: customProperties.type,
            }}
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                type: e.value as ItemType,
              });
            }}
            placeholder="Select Type"
            options={[
              "cast",
              "melee",
              "shield",
              "consumable",
              "other",
            ].map((i) => ({ label: i, value: i }))}
          />
          <Label>Tags:</Label>
          <Select
            value={
              customProperties.tags
                ? customProperties.tags.map((tag) => ({
                    label: tag,
                    value: tag,
                  }))
                : []
            }
            isMulti={true}
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                // @ts-ignore
                tags: e.map((opt) => opt.value) as any,
              });
            }}
            placeholder="Select Tags"
            options={["wood", "strength"].map((i) => ({ label: i, value: i }))}
          />
          <CheckBox
            checked={customProperties.equippable}
            label="Equippable"
            onClick={(checked) => {
              setCustomProperties({
                ...customProperties,
                equippable: checked,
              });
            }}
          />
          <Label>Damage:</Label>
          <Row>
            <Col xs={6}>
              <TextInput
                disabled={!customProperties.equippable}
                onChange={(e) => {
                  setCustomProperties({
                    ...customProperties,
                    damage: [
                      parseInt(e.target.value),
                      customProperties.damage ? customProperties.damage[1] : 0,
                    ],
                  });
                }}
                value={
                  customProperties.damage ? customProperties.damage[0] : ""
                }
                placeholder="Enter Lowest Damage"
                type="number"
              />
            </Col>
            <Col xs={6}>
              <TextInput
                disabled={!customProperties.equippable}
                onChange={(e) => {
                  setCustomProperties({
                    ...customProperties,
                    damage: [
                      customProperties.damage ? customProperties.damage[0] : 0,
                      parseInt(e.target.value),
                    ],
                  });
                }}
                value={
                  customProperties.damage ? customProperties.damage[1] : ""
                }
                placeholder="Enter Highest Damage"
                type="number"
              />
            </Col>
          </Row>
          <Label>Effect:</Label>
          <Select
            disabled={!customProperties.equippable}
            value={
              isPresent(customProperties.effect)
                ? getEffectSpec(customProperties.effect)
                : null
            }
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                effect: parseInt(e.value),
              });
            }}
            placeholder="Select Effect"
            options={effectSpecs.map((i) => ({
              label: i.spritesheet,
              value: i.id,
            }))}
          />
          <Label>Range:</Label>
          <TextInput
            disabled={!customProperties.equippable}
            onChange={(e) => {
              setCustomProperties({
                ...customProperties,
                range: parseInt(e.target.value),
              });
            }}
            value={
              isPresent(customProperties.range) ? customProperties.range : ""
            }
            placeholder="Enter Range"
            type="number"
          />
          <Button
            disabled={saving}
            onClick={() => {
              const updatedItemSpecs = itemSpecs.map((spec) =>
                spec.id === customProperties.id ? customProperties : spec
              );
              gameState.send("admin", "admin:itemSpec:update", {
                specs: updatedItemSpecs,
              });
              setSaving(true);
            }}
            value={saving ? "Saving..." : "Save"}
          />
        </>
      ) : null}
    </Section>
  );
};
