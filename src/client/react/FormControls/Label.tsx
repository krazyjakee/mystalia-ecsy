import React from "react";
import { createUseStyles } from "react-jss";
import { whiteText } from "../palette";

const useStyles = createUseStyles({
  root: {
    ...whiteText,
  },
});

type Props = {
  children: string | React.ReactChildren;
};

export const Label = (props: Props) => {
  const classes = useStyles();
  return <div className={classes.root}>{props.children}</div>;
};
