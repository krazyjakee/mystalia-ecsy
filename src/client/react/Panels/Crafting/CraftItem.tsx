import React, { CSSProperties } from "react";
import { tileIdToVector } from "utilities/tileMap";
import Sprite from "@client/react/Utilities/Sprite";
import { ItemSpec } from "types/TileMap/ItemTiles";
import { createUseStyles } from "react-jss";
import ReactTooltip from "react-tooltip";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    width: 48,
    height: 48,
    margin: "0 6px 6px 6px",
    padding: 12,
    boxSizing: "border-box",
    cursor: "pointer",
  },
});

type Props = {
  index: number;
  itemSpec?: ItemSpec;
};

export default ({ index, itemSpec }: Props) => {
  if (!itemSpec) return null;

  const classes = useStyles();

  const slotOffset = tileIdToVector(index, 5);

  const rootStyles: CSSProperties = {
    left: slotOffset.x * 60,
    top: slotOffset.y * 54,
  };

  return (
    <div
      className={classes.root}
      style={rootStyles}
      data-tip={`Craft ${itemSpec.name}`}
    >
      <ReactTooltip place="top" effect="solid" />
      <Sprite
        spriteId={itemSpec.spriteId}
        spritesheet={itemSpec.spritesheet}
        spriteSize={16}
        sizeMultiplier={1.5}
      />
    </div>
  );
};
