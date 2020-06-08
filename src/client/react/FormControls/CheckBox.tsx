import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";
import classNames from "classnames";

const useStyle = createUseStyles({
  root: {
    display: "flex",
    height: 28,
    cursor: "pointer",
  },
  checkbox: {
    position: "relative",
    backgroundImage: guiAssetPath("/form-control/check.png"),
    width: 28,
    height: 28,
    marginRight: 5,
  },
  checkboxInner: {
    position: "absolute",
    left: 8,
    top: 8,
    width: 10,
    height: 10,
    backgroundColor: "#698b39",
    border: "1px solid #84bc3f",
    boxShadow: "0px 0px 2px #333333",
  },
  label: {
    lineHeight: "28px",
    ...whiteText,
  },
});

type Props = {
  checked?: Boolean;
  label: string;
  onClick?: (checked: Boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const CheckBox = (props: Props) => {
  const classes = useStyle();
  const [checked, setChecked] = useState<Boolean>(false);

  const toggleChecked = () => {
    setChecked(!checked);
    if (props.onClick) props.onClick(!checked);
  };

  useEffect(() => {
    setChecked(props.checked || false);
  }, [props.checked, props.label]);

  return (
    <div className={classes.root} onClick={toggleChecked}>
      <div className={classes.checkbox}>
        {checked ? <div className={classes.checkboxInner} /> : null}
      </div>
      <div className={classes.label}>{props.label}</div>
    </div>
  );
};
