import React, { useState, useEffect } from "react";
import { MapSchema } from "@colyseus/schema";
import { useDrop, DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import Hotkey from "../../Utilities/Hotkey";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { Section } from "../Section";
import { useGameEvent } from "../../Hooks/useGameEvent";
import itemsData from "utilities/data/items.json";
import { InventoryItems } from "types/TileMap/ItemTiles";
import InventoryItem from "./InventoryItem";
import InventoryState from "@server/components/inventory";
import gameState from "../../../gameState";

const useStyles = createUseStyles({
  plank: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-plank.png"),
    width: 343,
    height: 55,
    marginBottom: 10,
  },
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
});

type Props = {
  forceEnable?: boolean;
  propsInventoryState?: MapSchema<InventoryState>;
};

const EmptySlot = (props: { index: number }) => {
  const classes = useStyles();
  const onDrop = () => ({ index: props.index });

  const [_, drop] = useDrop({
    accept: "x",
    drop: onDrop,
  });
  return <div className={classes.emptySlot} ref={drop} />;
};

export default ({ forceEnable = false, propsInventoryState }: Props) => {
  const classes = useStyles();
  const [inventoryState] = useGameEvent("localPlayer:inventory:response");
  const [iState, setiState] = useState<MapSchema<InventoryState>>();

  useEffect(() => {
    //if (!iState) {
    setiState(inventoryState || propsInventoryState);
    //}
  });

  const onDrop = (from: number, to: number) => {
    if (iState) {
      gameState.send("map", "localPlayer:inventory:move", {
        from,
        to,
      });

      const newIState = new MapSchema<InventoryState>(iState);
      for (let key in newIState) {
        const item = newIState[key] as InventoryState;
        if (item.position === from) {
          newIState[key].position = to;
        } else if (item.position === to) {
          newIState[key].position = from;
        }
      }
      setiState(newIState);
    }
  };

  const inventoryItems: Array<InventoryItems> = [];
  if (iState) {
    for (let key in iState) {
      const item = iState[key] as InventoryState;
      const { itemId, position, quantity } = item;
      const itemData = itemsData.find((data) => data.id === itemId);
      if (itemData) {
        const { spritesheet, spriteId, name } = itemData;

        inventoryItems[position] = {
          itemId,
          position,
          quantity,
          spritesheet,
          spriteId,
          name,
        };
      }
    }
  }

  const slotRows = 6;
  const emptySlots = new Array(slotRows * 5).fill(0);

  return (
    <Hotkey keys={["KeyI"]} show={forceEnable}>
      <BasePanel
        title="Inventory"
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
      >
        <Grid fluid>
          <Row>
            <Col>
              <div className={classes.plank} />
              <Section>
                <Grid fluid>
                  <Row>
                    <Col className={classes.slotContainer}>
                      <DndProvider backend={Backend}>
                        <div>
                          {emptySlots.map((_, index) => (
                            <EmptySlot key={index} index={index} />
                          ))}
                          {inventoryItems.map((item) => (
                            <InventoryItem
                              key={item.position}
                              item={item}
                              onDrop={onDrop}
                            />
                          ))}
                        </div>
                      </DndProvider>
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
