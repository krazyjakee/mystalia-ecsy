import React, { useState, useEffect, CSSProperties } from "react";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";

import { itemAssetPath } from "../../../utilities/assets";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";

type Props = {
  item: InventoryItems;
};

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
  },
  sprite: {
    width: 24,
    height: 24,
  },
});

export default (props: Props) => {
  const classes = useStyles();
  const { item } = props;

  const [spriteSheetWidth, setSpriteSheetWidth] = useState<number>();

  useEffect(() => {
    const image = new Image();
    image.src = itemAssetPath(item.spritesheet);
    image.onload = () => {
      setSpriteSheetWidth(image.width);
    };
  }, [item]);

  if (!spriteSheetWidth) {
    return null;
  }

  const spriteOffset = tileIdToPixels(item.spriteId, spriteSheetWidth / 16, 16);
  const slotOffset = tileIdToVector(item.position, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x,
    top: slotOffset.y,
  };

  const spriteStyles: CSSProperties = {
    backgroundImage: `url(${itemAssetPath(item.spritesheet)})`,
    backgroundPosition: `${spriteOffset.x}px ${spriteOffset.y}px`,
  };

  return (
    <div className={classes.root} style={rootStyles}>
      <div className={classes.sprite} style={spriteStyles}></div>
    </div>
  );
};
