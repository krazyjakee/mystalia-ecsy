import React from "react";
import { createUseStyles } from "react-jss";
import classnames from "classnames";
import { guiAssetPath } from "../cssUtilities";
import { IconType } from "react-icons/lib/cjs";

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
  icon: {
    color: "rgba(0,0,0,0.6)",
    marginTop: 3,
  },
});

type Props = {
  active?: boolean;
  Icon: IconType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = (props: Props) => {
  const classes = useStyles();
  const { active, Icon, className, ...rest } = props;
  return (
    <button
      className={classnames(
        classes.input,
        className,
        active ? classes.active : null
      )}
      {...rest}
    >
      <Icon className={classes.icon} />
    </button>
  );
};
