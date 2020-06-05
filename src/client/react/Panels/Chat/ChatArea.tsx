import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    height: 80,
  },
});

export default () => {
  const classes = useStyles();
  return <div className={classes.root}></div>;
};
