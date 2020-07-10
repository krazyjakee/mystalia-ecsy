import React, { useState, useEffect } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { Section } from "../Section";
import { ShopSpec } from "types/shops";
import ShopItem from "./ShopItem";
import { useGameEvent } from "@client/react/Hooks/useGameEvent";
import inventoryStateToArray from "../Inventory/inventoryStateToArray";
import gameState from "@client/gameState";
import shops from "utilities/data/shop.json";

const useStyles = createUseStyles({
  plank: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-plank.png"),
    width: 343,
    height: 55,
    marginBottom: 10,
  },
});

const sendTrade = (shopId: number, tradeIndex: number, valid: boolean) => {
  if (valid) {
    gameState.send("map", "localPlayer:shop:trade", { shopId, tradeIndex });
  }
};

type Props = {
  forceShow?: boolean;
  shop?: ShopSpec;
};

export default ({ forceShow = false, shop: propShop }: Props) => {
  const classes = useStyles();

  const [inventoryState] = useGameEvent("localPlayer:inventory:response");
  const [shop, setShop] = useState(propShop);

  useEffect(() => {
    const shopOpen = ({ shopId }) => {
      const shopSpec = shops.find((s) => s.id === shopId);
      setShop(shopSpec);
    };

    gameState.subscribe("localPlayer:shop:open", shopOpen);
    return () => gameState.unsubscribe("localPlayer:shop:open", shopOpen);
  }, []);

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

  return forceShow || shop ? (
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
      onCloseClick={() => setShop(undefined)}
    >
      <Grid fluid>
        <Row>
          <Col>
            <div className={classes.plank} />
            <Section>
              <Grid fluid>
                <Row>
                  {trades.map((trade, index) => (
                    <ShopItem
                      key={index}
                      trade={trade}
                      valid={validTrades[index]}
                      onClick={() =>
                        sendTrade(shop.id, index, validTrades[index])
                      }
                    />
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
