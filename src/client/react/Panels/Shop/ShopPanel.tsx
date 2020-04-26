import React, { useState } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { Section } from "../Section";
import { ShopSpec } from "types/shops";
import ShopItem from "./ShopItem";
import { useGameEvent } from "@client/react/Hooks/useGameEvent";
import inventoryStateToArray from "../Inventory/inventoryStateToArray";

const useStyles = createUseStyles({
  plank: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-plank.png"),
    width: 343,
    height: 55,
    marginBottom: 10,
  },
});

type Props = {
  forceEnable?: boolean;
  shop?: ShopSpec;
};

// TODO need to initiate a trade on click
// TODO need to show the panel when a shop is clicked and the player is next to it

export default ({ forceEnable = false, shop: propShop }: Props) => {
  const classes = useStyles();

  const [inventoryState] = useGameEvent("localPlayer:inventory:response");
  const [shop, setShop] = useState(propShop);
  if (!shop) return null;

  const inventoryArray = inventoryStateToArray(inventoryState);
  const { trades } = shop;

  let validTrades: boolean[] = [];
  if (inventoryArray) {
    const inventoryItemCounts = inventoryArray.reduce((accumulator, item) => {
      const existingItem = accumulator.findIndex((a) => a[0] === item.itemId);
      if (existingItem > -1) {
        accumulator[existingItem][1] += item.quantity;
      } else {
        accumulator.push([item.itemId, item.quantity]);
      }
      return accumulator;
    }, [] as number[][]);

    validTrades = trades.map((trade) => {
      const itemCount = inventoryItemCounts.find((ic) => ic[0] === trade.buy);
      return itemCount ? itemCount[1] >= trade.buyAmount : false;
    });
  }

  return forceEnable ? (
    <BasePanel
      title={shop.name}
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
                  {trades.map((trade, index) => (
                    <ShopItem trade={trade} valid={validTrades[index]} />
                  ))}
                </Row>
              </Grid>
            </Section>
          </Col>
        </Row>
      </Grid>
    </BasePanel>
  ) : null;
};
