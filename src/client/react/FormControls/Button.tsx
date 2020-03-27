import React from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import classnames from "classnames";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    cursor: "pointer",
    "&:active": {
      "& $leftAddon": {
        backgroundImage: "url(/assets/gui/form-control/button-pressed-side.png)"
      },
      "& $rightAddon": {
        backgroundImage: "url(/assets/gui/form-control/button-pressed-side.png)"
      },
      "& $input": {
        backgroundImage: "url(/assets/gui/form-control/button-pressed-bg.png)",
        color: "#bababa"
      }
    },
    "&:hover": {
      "& $leftAddon": {
        backgroundImage: "url(/assets/gui/form-control/button-hover-side.png)"
      },
      "& $rightAddon": {
        backgroundImage: "url(/assets/gui/form-control/button-hover-side.png)"
      },
      "& $input": {
        backgroundImage: "url(/assets/gui/form-control/button-hover-bg.png)"
      }
    }
  },
  addon: {
    width: 27,
    height: 36
  },
  leftAddon: {
    backgroundImage: "url(/assets/gui/form-control/button-side.png)"
  },
  rightAddon: {
    backgroundImage: "url(/assets/gui/form-control/button-side.png)",
    transform: "scaleX(-1)"
  },
  input: {
    height: 36,
    backgroundImage: "url(/assets/gui/form-control/button-bg.png)",
    border: "none",
    padding: "0 8px",
    margin: 0,
    outline: "none",
    cursor: "pointer",
    ...whiteText
  }
});

export const Button = (props: React.InputHTMLAttributes<HTMLButtonElement>) => {
  const classes = useStyles();
  return (
    <a className={classes.container}>
      <div className={classnames(classes.leftAddon, classes.addon)}></div>
      <button className={classes.input}>{props.value}</button>
      <div className={classnames(classes.rightAddon, classes.addon)}></div>
    </a>
  );
};
