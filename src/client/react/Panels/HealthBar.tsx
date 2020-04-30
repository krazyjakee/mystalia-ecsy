import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  healthBarContainer: {
    position: "absolute",
  },
  healthBarBackground: {
    position: "absolute",
    filter: "grayscale(100%) brightness(0.7)",
    backgroundImage: guiAssetPath("panel/healthbar.png"),
    backgroundSize: "100% 100%",
  },
  healthBar: {
    position: "absolute",
    backgroundImage: guiAssetPath("panel/healthbar.png"),
    backgroundSize: "100% 100%",
  },
});

type Props = {
  left: number;
  top: number;
  width: number;
  height?: number;
  percentage?: number;
  hue?: number;
};

export default ({
  left,
  top,
  width,
  height = 13,
  percentage = 100,
  hue = 0,
}: Props) => {
  const classes = useStyles();
  const size = { width, height };

  return (
    <div
      className={classes.healthBarContainer}
      style={{ left, top, height, width }}
    >
      <div className={classes.healthBarBackground} style={size}></div>
      <div
        className={classes.healthBar}
        style={{
          height,
          width: `${percentage}%`,
          filter: `hue-rotate(${hue}deg)`,
        }}
      ></div>
    </div>
  );
};
