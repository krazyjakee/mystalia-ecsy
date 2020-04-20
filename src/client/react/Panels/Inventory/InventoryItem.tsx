import React, { useState, useEffect, CSSProperties } from "react";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";

import { itemAssetPath } from "../../../utilities/assets";
import { tileIdToPixels, tileIdToVector } from "utilities/tileMap";
import { whiteText } from "../../palette";
import { useDrag, useDrop } from "react-dnd";

type Props = {
  item: InventoryItems;
  onDrop: (from: number, to: number) => void;
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
  sprite: {
    width: 24,
    height: 24,
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
  const { item, onDrop: propsOnDrop } = props;

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

  const [collectedProps, drag] = useDrag({
    item: { id: item.position, type: "x" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        // @ts-ignore
        propsOnDrop(item.id, dropResult.index);
      }
    },
  });

  const onDrop = () => ({ index: item.position });

  const [_, drop] = useDrop({
    accept: "x",
    drop: onDrop,
  });

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
    top: slotOffset.y * 54,
  };

  const spriteStyles: CSSProperties = {
    backgroundImage: `url(${itemAssetPath(item.spritesheet)})`,
    backgroundPosition: `-${spriteOffset.x}px -${spriteOffset.y}px`,
    backgroundSize: `${spriteSheetSize.width * 1.5}px ${spriteSheetSize.height *
      1.5}px`,
  };

  return (
    <div ref={drop}>
      <div
        className={classes.root}
        style={rootStyles}
        title={item.name}
        ref={drag}
      >
        <div className={classes.sprite} style={spriteStyles}></div>
        <div className={classes.quantity}>
          {item.quantity > 1 ? item.quantity : ""}
        </div>
      </div>
    </div>
  );
};
