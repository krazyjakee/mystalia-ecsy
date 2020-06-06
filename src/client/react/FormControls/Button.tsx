import React, { ButtonHTMLAttributes } from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import classnames from "classnames";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    cursor: "pointer",
    "&:active": {
      "& $leftAddon": {
        backgroundImage: guiAssetPath("form-control/button-pressed-side.png"),
      },
      "& $rightAddon": {
        backgroundImage: guiAssetPath("form-control/button-pressed-side.png"),
      },
      "& $input": {
        backgroundImage: guiAssetPath("form-control/button-pressed-bg.png"),
        color: "#bababa",
      },
    },
    "&:hover": {
      "& $leftAddon": {
        backgroundImage: guiAssetPath("form-control/button-hover-side.png"),
      },
      "& $rightAddon": {
        backgroundImage: guiAssetPath("form-control/button-hover-side.png"),
      },
      "& $input": {
        backgroundImage: guiAssetPath("form-control/button-hover-bg.png"),
      },
    },
  },
  addon: {
    width: 27,
    height: 36,
  },
  leftAddon: {
    backgroundImage: guiAssetPath("form-control/button-side.png"),
  },
  rightAddon: {
    backgroundImage: guiAssetPath("form-control/button-side.png"),
    transform: "scaleX(-1)",
  },
  input: {
    width: "100%",
    height: 36,
    background: "transparent",
    backgroundImage: guiAssetPath("form-control/button-bg.png"),
    border: "none",
    padding: "0 8px",
    margin: 0,
    outline: "none",
    cursor: "pointer",
    ...whiteText,
  },
  active: {
    filter: "brightness(1.4) !important",
  },
});

type Props = {
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export const Button = (props: Props) => {
  const classes = useStyles();
  const { className, ...rest } = props;
  return (
    <div
      className={classnames(
        classes.container,
        className,
        props.active ? classes.active : null
      )}
    >
      <div className={classnames(classes.leftAddon, classes.addon)}></div>
      <button className={classes.input} {...rest}>
        {props.value}
      </button>
      <div className={classnames(classes.rightAddon, classes.addon)}></div>
    </div>
  );
};
