import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    minWidth: 300,
    minHeight: 250,
    boxSizing: "border-box",
    padding: "0 18px",
    display: "flex",
    flexDirection: "column"
  },
  border: {
    position: "relative",
    flex: 1,
    display: "flex",
    backgroundImage: guiAssetPath("panel/panel-bg.png"),
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
    "&:before": {
      boxSizing: "border-box",
      position: "absolute",
      height: "100%",
      width: "100%",
      content: '""',
      display: "block",
      borderStyle: "solid",
      borderWidth: 57,
      borderImageSource: guiAssetPath("panel/panel-border.png"),
      borderImageSlice: 57,
      borderImageRepeat: "round"
    }
  },
  header: {
    position: "relative",
    height: 59,
    backgroundImage: guiAssetPath("panel/panel-heading-bg.png"),
    backgroundRepeat: "repeat-x",
    backgroundPosition: "0 13px",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      bottom: -8,
      width: 130,
      height: 67,
      backgroundImage: guiAssetPath("panel/panel-heading-side.png")
    },
    "&:before": {
      left: -18
    },
    "&:after": {
      right: -18,
      transform: "scaleX(-1)"
    }
  },
  labelContainer: {
    height: 0,
    textAlign: "center"
  },
  label: {
    display: "inline-block",
    position: "relative",
    zIndex: 1,
    height: 24,
    padding: "9px 39px",
    backgroundImage: guiAssetPath("panel/panel-label-bg.png"),
    backgroundRepeat: "repeat-x",
    ...whiteText,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      bottom: 3,
      width: 39,
      height: 42,
      backgroundImage: guiAssetPath("panel/panel-label-side.png")
    },
    "&:before": {
      left: -18
    },
    "&:after": {
      right: -18,
      transform: "scaleX(-1)"
    }
  },
  content: {
    flex: 1,
    padding: 25,
    display: "flex"
  }
});

export const BasePanel = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const classes = useStyles();

  return (
    <div className={classes.container} {...props}>
      <div className={classes.labelContainer}>
        {props.title && <span className={classes.label}>{props.title}</span>}
      </div>
      <div className={classes.header}></div>
      <div className={classes.border}>
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );
};
