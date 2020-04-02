import React from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";

const useStyles = createUseStyles({
  container: {
    display: "block",
    borderStyle: "solid",
    borderWidth: 6,
    borderImageSource: guiAssetPath("panel/section-border.png"),
    borderImageSlice: 6,
    borderImageRepeat: "round",
    padding: 5
  },
  label: {
    ...whiteText,
    padding: "5px 0"
  }
});

type Props = {
  label?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const SubSection = (props: Props) => {
  const classes = useStyles();

  return (
    <div {...props} className={classes.container}>
      {props.label ? <div className={classes.label}>{props.label}</div> : null}
      {props.children}
    </div>
  );
};
