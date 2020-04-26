import React, { useState } from "react";
import { Row, Col, Grid } from "react-flexbox-grid";
import { BasePanel } from "../BasePanel";
import { guiAssetPath } from "../../cssUtilities";
import { createUseStyles } from "react-jss";
import { Section } from "../Section";
import { ShopSpec } from "types/shops";
import ShopItem from "./ShopItem";

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

// TODO need player inventory to figure out acceptable trades.
// TODO need to initiate a trade on click
// TODO need to show the panel when a shop is clicked and the player is next to it

export default ({ forceEnable = false, shop: propShop }: Props) => {
  const classes = useStyles();

  const [shop, setShop] = useState(propShop);
  if (!shop) return null;

  const { trades } = shop;

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
                  {trades.map((trade) => (
                    <ShopItem trade={trade} />
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
