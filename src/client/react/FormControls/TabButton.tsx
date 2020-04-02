import React, { ButtonHTMLAttributes } from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import classnames from "classnames";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  input: {
    width: 231,
    height: 52,
    background: "transparent",
    backgroundImage: guiAssetPath("form-control/tab-button.png"),
    border: "none",
    padding: "0 8px",
    margin: 0,
    outline: "none",
    cursor: "pointer",
    ...whiteText,
    "&:active": {
      filter: "brightness(0.8) !important"
    },
    "&:hover": {
      filter: "brightness(1.2)"
    }
  },
  active: {
    filter: "brightness(1.4) !important"
  }
});

type Props = {
  active?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TabButton = (props: Props) => {
  const classes = useStyles();
  return (
    <button
      className={classnames(
        classes.input,
        props.active ? classes.active : null
      )}
      {...props}
    >
      {props.value}
    </button>
  );
};
