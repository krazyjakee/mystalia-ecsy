import React, { CSSProperties } from "react";
import { InventoryItems } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";
import { tileIdToVector } from "utilities/tileMap";
import { whiteText } from "../../palette";
import { useDrag, useDrop } from "react-dnd";
import Sprite from "@client/react/Utilities/Sprite";
import gameState from "@client/gameState";
import ReactTooltip from "react-tooltip";

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
  quantity: {
    position: "absolute",
    right: 4,
    bottom: 4,
    fontSize: 12,
    ...whiteText,
  },
});

const equip = (position: number) => {
  gameState.send("map", "localPlayer:inventory:equip", { position });
};

export default (props: Props) => {
  const classes = useStyles();
  const { item, onDrop: propsOnDrop } = props;

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

  const slotOffset = tileIdToVector(item.position, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x * 60,
    top: slotOffset.y * 54,
    border: item.equipped ? "1px solid red" : undefined,
  };

  return (
    <div ref={drop}>
      <ReactTooltip place="top" effect="solid" />
      <div
        className={classes.root}
        style={rootStyles}
        data-tip={item.name}
        ref={drag}
        onDoubleClick={() => equip(item.position)}
      >
        <Sprite
          spriteId={item.spriteId}
          spritesheet={item.spritesheet}
          spriteSize={16}
          sizeMultiplier={1.5}
        />
        <div className={classes.quantity}>
          {item.quantity > 1 ? item.quantity : ""}
        </div>
      </div>
    </div>
  );
};
