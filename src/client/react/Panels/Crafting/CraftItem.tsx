import React, { CSSProperties } from "react";
import { tileIdToVector } from "utilities/tileMap";
import Sprite from "@client/react/Utilities/Sprite";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";
import ReactTooltip from "react-tooltip";
import { whiteText } from "@client/react/palette";
import gameState from "@client/gameState";
import { AvailableCraftable } from "./CraftingPanel";

const itemSpecs = require("utilities/data/items.json") as ItemSpec[];

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 12,
    boxSizing: "border-box",
  },
  toolTipIngredient: {
    position: "relative",
    float: "left",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 18,
    boxSizing: "border-box",
  },
  toolTipQuantity: {
    position: "absolute",
    bottom: 0,
    right: 0,
    ...whiteText,
  },
  toolTipItemName: {
    marginBottom: 10,
    textAlign: "center",
    ...whiteText,
  },
  toolTipName: {
    position: "absolute",
    top: 0,
    left: 3,
    ...whiteText,
  },
  toolTipRequiredItem: {
    position: "relative",
    float: "left",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 17,
    boxSizing: "border-box",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid white",
  },
  cannotCraft: {
    opacity: 0.5,
    filter: "grayscale(100%)",
  },
});

type Props = {
  index: number;
  craftableSpec: AvailableCraftable;
  itemSpec?: ItemSpec;
};

export default ({ index, itemSpec, craftableSpec }: Props) => {
  if (!itemSpec) return null;

  const classes = useStyles();

  const slotOffset = tileIdToVector(index, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x * 60,
    top: slotOffset.y * 54,
    cursor: craftableSpec.canCraft ? "pointer" : "default",
  };

  const ingredients = craftableSpec?.ingredients.map((spec) => {
    const item = itemSpecs.find((itemSpec) => itemSpec.id === spec.itemId);
    if (item) {
      return (
        <div className={classes.toolTipIngredient}>
          <div className={classes.toolTipName}>{item.name}</div>
          <Sprite
            key={`ingredients${spec.itemId}`}
            spriteId={item.spriteId}
            spritesheet={item.spritesheet}
            spriteSize={16}
          />
          <div className={classes.toolTipQuantity}>{spec.quantity}</div>
        </div>
      );
    }
  });
  const requiredItems = craftableSpec?.requiredItems.map((itemId) => {
    const item = itemSpecs.find((itemSpec) => itemSpec.id === itemId);
    if (item) {
      return (
        <div className={classes.toolTipRequiredItem}>
          <div className={classes.toolTipName}>{item.name}</div>
          <Sprite
            key={`required${itemId}`}
            spriteId={item.spriteId}
            spritesheet={item.spritesheet}
            spriteSize={16}
          />
        </div>
      );
    }
  });
  const id = `craftItem-toolip-${index}`;

  return (
    <div
      className={classes.root}
      style={rootStyles}
      data-for={id}
      data-tip={""}
      onClick={() => {
        if (craftableSpec.canCraft) {
          gameState.send("map", "localPlayer:craft:request", {
            craftableId: craftableSpec.id,
          });
        }
      }}
    >
      <ReactTooltip id={id} place="top" effect="solid">
        <div>
          <div className={classes.toolTipItemName}>{itemSpec.name}</div>
          {requiredItems}
          {ingredients}
        </div>
      </ReactTooltip>
      <Sprite
        className={craftableSpec.canCraft ? "" : classes.cannotCraft}
        spriteId={itemSpec.spriteId}
        spritesheet={itemSpec.spritesheet}
        spriteSize={16}
        sizeMultiplier={1.5}
      />
    </div>
  );
};
