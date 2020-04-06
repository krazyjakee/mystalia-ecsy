import React, { useState, useEffect, CSSProperties } from "react";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";

import { itemAssetPath } from "../../../utilities/assets";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";
import { whiteText } from "../../palette";

type Props = {
  item: InventoryItems;
};

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 12,
    boxSizing: "border-box"
  },
  sprite: {
    width: 24,
    height: 24
  },
  quantity: {
    position: "absolute",
    right: 4,
    bottom: 4,
    fontSize: 12,
    ...whiteText
  }
});

export default (props: Props) => {
  const classes = useStyles();
  const { item } = props;

  const [spriteSheetSize, setSpriteSheetSize] = useState<{
    width: number;
    height: number;
  }>();

  useEffect(() => {
    const image = new Image();
    image.src = itemAssetPath(item.spritesheet);
    image.onload = () => {
      setSpriteSheetSize({ width: image.width, height: image.height });
    };
  }, [item]);

  if (!spriteSheetSize) {
    return null;
  }

  const spriteOffset = tileIdToPixels(
    item.spriteId,
    spriteSheetSize.width / 16,
    24
  );
  const slotOffset = tileIdToVector(item.position, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x * 60,
    top: slotOffset.y * 54
  };

  const spriteStyles: CSSProperties = {
    backgroundImage: `url(${itemAssetPath(item.spritesheet)})`,
    backgroundPosition: `-${spriteOffset.x}px -${spriteOffset.y}px`,
    backgroundSize: `${spriteSheetSize.width * 1.5}px ${spriteSheetSize.height *
      1.5}px`
  };

  return (
    <div className={classes.root} style={rootStyles} title={item.name}>
      <div className={classes.sprite} style={spriteStyles}></div>
      <div className={classes.quantity}>
        {item.quantity > 1 ? item.quantity : ""}
      </div>
    </div>
  );
};
