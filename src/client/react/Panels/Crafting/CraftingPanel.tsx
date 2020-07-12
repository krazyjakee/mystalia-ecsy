// TODO: Create crafting panel
import React, { useState, useEffect, CSSProperties } from "react";
import { MapSchema } from "@colyseus/schema";
import { useDrop } from "react-dnd";
import { Row, Col, Grid } from "react-flexbox-grid";
import { createUseStyles } from "react-jss";
import InventoryState from "@server/components/inventory";
import { triggerGlobalKeypress } from "utilities/input";
import { guiAssetPath } from "../../cssUtilities";
import { useGameEvent } from "../../Hooks/useGameEvent";
import inventoryStateToArray from "../Inventory/inventoryStateToArray";
import Hotkey from "../../Utilities/Hotkey";
import { BasePanel } from "../BasePanel";
import { Section } from "../Section";
import { CraftableSpec } from "types/craftable";
import mergeQuantities from "./mergeQuantities";
import CraftItem from "./CraftItem";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { canCraft } from "utilities/inventory/crafting";
import InventoryItem from "../Inventory/InventoryItem";

const craftingSpecs = require("utilities/data/craftables.json") as CraftableSpec[];
const itemSpecs = require("utilities/data/items.json") as ItemSpec[];

const useStyles = createUseStyles({
  emptySlot: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-slot.png"),
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    float: "left",
  },
  slotContainer: {
    position: "relative",
  },
  plank: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-plank.png"),
    width: 343,
    height: 55,
    marginBottom: 10,
  },
});

export type AvailableCraftable = {
  canCraft: boolean;
} & CraftableSpec;

type Props = {
  forceShow?: boolean;
  propsInventoryState?: MapSchema<InventoryState>;
};

export default ({ forceShow = false, propsInventoryState }: Props) => {
  const classes = useStyles();
  const [inventoryState] = useGameEvent("localPlayer:inventory:response");
  const [iState, setiState] = useState<MapSchema<InventoryState>>();

  useEffect(() => {
    setiState(inventoryState || propsInventoryState);
  });

  let availableCraftItems: AvailableCraftable[] = [];

  if (iState) {
    availableCraftItems = craftingSpecs
      .map((c) => ({
        ...c,
        canCraft: canCraft(iState, c),
      }))
      .sort((a) => {
        if (a.canCraft) {
          return 1;
        }
        return 0;
      });
  }

  const slotRows = 6;
  const emptySlots = new Array(slotRows * 5).fill(0);

  return (
    <Hotkey keys={["KeyC"]} show={forceShow}>
      <BasePanel
        title="Crafting"
        rndOptions={{
          defaultWidth: 446,
          defaultHeight: 535,
          enableResizing: {
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            left: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false,
          },
        }}
        isDraggable={true}
        onCloseClick={() => triggerGlobalKeypress("C")}
      >
        <Grid fluid>
          <Row>
            <Col>
              <div className={classes.plank} />
              <Section>
                <Grid fluid>
                  <Row>
                    <Col className={classes.slotContainer}>
                      <div>
                        {availableCraftItems.map((item, index) => {
                          const itemSpec = itemSpecs.find(
                            (i) => i.id === item.item
                          );
                          return (
                            <CraftItem
                              key={index}
                              index={index}
                              itemSpec={itemSpec}
                              craftableSpec={item}
                            />
                          );
                        })}
                        {emptySlots.map((_, index) => (
                          <div key={index} className={classes.emptySlot} />
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </Section>
            </Col>
          </Row>
        </Grid>
      </BasePanel>
    </Hotkey>
  );
};
