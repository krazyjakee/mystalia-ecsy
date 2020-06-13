import React, { CSSProperties } from "react";
import { createUseStyles } from "react-jss";
import { tileIdToVector } from "utilities/tileMap";
import { whiteText } from "../../palette";
import Sprite from "@client/react/Utilities/Sprite";
import LootItemState from "@server/components/lootItem";
import { ItemSpec } from "types/TileMap/ItemTiles";

const itemSpecs = require("utilities/data/items.json") as ItemSpec[];

type Props = {
  lootItem: LootItemState;
  onClick: (item: LootItemState) => void;
};

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 12,
    boxSizing: "border-box",
  },
  quantity: {
    position: "absolute",
    right: 4,
    bottom: 4,
    fontSize: 12,
    ...whiteText,
  },
});

export default (props: Props) => {
  const classes = useStyles();
  const { lootItem } = props;

  const item = itemSpecs.find((spec) => spec.id === lootItem.itemId);

  const slotOffset = tileIdToVector(lootItem.position, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x * 60,
    top: slotOffset.y * 54,
  };

  if (!item) return null;

  return (
    <div onClick={() => props.onClick(lootItem)}>
      <div className={classes.root} style={rootStyles} title={item?.name}>
        <Sprite
          spriteId={item.spriteId}
          spritesheet={item.spritesheet}
          spriteSize={16}
          sizeMultiplier={1.5}
        />
        <div className={classes.quantity}>
          {lootItem.quantity > 1 ? lootItem.quantity : ""}
        </div>
      </div>
    </div>
  );
};
