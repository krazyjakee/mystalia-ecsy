import React from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import classnames from "classnames";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  container: {
    display: "flex"
  },
  addon: {
    width: 28,
    height: 38
  },
  leftAddon: {
    backgroundImage: guiAssetPath("form-control/input-side.png")
  },
  rightAddon: {
    backgroundImage: guiAssetPath("form-control/input-side.png"),
    transform: "scaleX(-1)"
  },
  input: {
    flex: 1,
    height: 38,
    backgroundColor: "transparent",
    backgroundImage: guiAssetPath("form-control/input-bg.png"),
    border: "none",
    padding: 0,
    margin: 0,
    outline: "none",
    fontSize: 11,
    ...whiteText
  }
});

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props: React.InputHTMLAttributes<HTMLInputElement>, ref) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classnames(classes.leftAddon, classes.addon)}></div>
      <input ref={ref} className={classes.input} type="text" {...props} />
      <div className={classnames(classes.rightAddon, classes.addon)}></div>
    </div>
  );
});
