import React, { ButtonHTMLAttributes } from "react";
import { whiteText } from "../palette";
import { createUseStyles } from "react-jss";
import classnames from "classnames";
import { guiAssetPath } from "../cssUtilities";

const useStyles = createUseStyles({
  input: {
    width: 37,
    height: 37,
    background: "transparent",
    backgroundImage: guiAssetPath("form-control/icon-btn.png"),
    border: "none",
    margin: 0,
    outline: "none",
    cursor: "pointer",
    "&:active": {
      filter: "brightness(0.8) !important",
    },
    "&:hover": {
      filter: "brightness(1.2)",
    },
  },
  active: {
    filter: "brightness(1.4) !important",
  },
});

type Props = {
  active?: boolean;
  Icon: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = (props: Props) => {
  const classes = useStyles();
  const { active, Icon } = props;
  return (
    <button
      className={classnames(classes.input, active ? classes.active : null)}
      {...props}
    >
      {Icon}
    </button>
  );
};
