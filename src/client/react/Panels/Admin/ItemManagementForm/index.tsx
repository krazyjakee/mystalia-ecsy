import { Section } from "../../Section";
import React, { useState } from "react";
import { ItemSpec, ItemType } from "types/TileMap/ItemTiles";
import Select from "@client/react/FormControls/Select";
import Sprite from "@client/react/Utilities/Sprite";
import { TextInput } from "@client/react/FormControls/TextInput";

const itemSpecs = require("utilities/data/items.json") as ItemSpec[];

export const SelectedUser = React.createContext<string | null>("selectedUser");

export default ({ show = false }) => {
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const options = itemSpecs.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const getSpec = (id = 0) => {
    return itemSpecs.find((spec) => spec.id === id) as ItemSpec;
  };

  const [customProperties, setCustomProperties] = useState<ItemSpec>(getSpec());

  if (!show) return null;

  /*
    TODO:
    equippable?: boolean;
    tags?: ItemTags[];
    damage?: [number, number];
    effect?: number;
    range?: number;
  */

  return (
    <Section>
      <Select
        value={options[selectedItem]}
        onChange={(e) => {
          const value = parseInt(e.value);
          setSelectedItem(value);
          setCustomProperties(getSpec(value));
        }}
        placeholder="Select Item"
        options={options}
      />
      {customProperties ? (
        <>
          <Sprite
            spriteId={customProperties.spriteId}
            spritesheet={customProperties.spritesheet}
            spriteSize={16}
            sizeMultiplier={2}
          />
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
        </>
      ) : null}
    </Section>
  );
};
