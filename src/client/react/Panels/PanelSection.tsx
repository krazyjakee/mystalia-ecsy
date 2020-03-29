import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "block",
    borderStyle: "solid",
    borderWidth: 6,
    borderImageSource: guiAssetPath("panel/section-border.png"),
    borderImageSlice: 6,
    borderImageRepeat: "round"
  }
});

export const PanelSection = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const classes = useStyles();

  return (
    <div {...props} className={classes.container}>
      {props.children}
    </div>
  );
};
