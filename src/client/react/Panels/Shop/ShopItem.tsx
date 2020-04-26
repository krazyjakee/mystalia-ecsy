import React from "react";
import { createUseStyles } from "react-jss";
import { Col, Row } from "react-flexbox-grid";
import { guiAssetPath } from "@client/react/cssUtilities";
import { TradeSpec } from "types/shops";
import Sprite from "@client/react/Utilities/Sprite";
import itemsData from "utilities/data/items.json";
import { isPresent } from "utilities/guards";
import { whiteText } from "@client/react/palette";
import pluralize from "pluralize";

const useStyles = createUseStyles({
  root: {
    width: "100%",
  },
  iconContainer: {
    backgroundImage: guiAssetPath("panel/inventory/inventory-slot.png"),
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  labelCol: {},
  icon: {
    width: 24,
    height: 24,
  },
  sellLabel: {
    ...whiteText,
  },
  buyItemIcon: {
    display: "inline-block",
    marginRight: 5,
  },
  buyLabel: {
    marginTop: 8,
    float: "right",
    ...whiteText,
  },
});

type Props = {
  trade: TradeSpec;
  valid: boolean;
};

export default ({ trade, valid }: Props) => {
  const classes = useStyles();

  const buyItem = itemsData.find((item) => item.id === trade.buy);
  const sellItem = itemsData.find((item) => item.id === trade.sell);

  if (isPresent(buyItem) && isPresent(sellItem)) {
    return (
      <Col
        className={classes.root}
        style={{ opacity: valid ? undefined : 0.5 }}
      >
        <Row>
          <Col xs={2}>
            <div className={classes.iconContainer}>
              <Sprite
                className={classes.icon}
                spriteId={sellItem.spriteId}
                spritesheet={sellItem.spritesheet}
                spriteSize={16}
                sizeMultiplier={1.5}
              />
            </div>
          </Col>
          <Col xs={10}>
            <div className={classes.sellLabel}>
              {trade.sellAmount} {pluralize(sellItem.name, trade.sellAmount)}
            </div>
            <div className={classes.buyLabel}>
              <Sprite
                className={classes.buyItemIcon}
                spriteId={buyItem.spriteId}
                spritesheet={buyItem.spritesheet}
                spriteSize={16}
              />
              {trade.buyAmount} {pluralize(buyItem.name, trade.buyAmount)}
            </div>
          </Col>
        </Row>
      </Col>
    );
  }
  return null;
};
