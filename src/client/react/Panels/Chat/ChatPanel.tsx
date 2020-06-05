import React from "react";
import { createUseStyles } from "react-jss";
import { Button } from "@client/react/FormControls/Button";
import { whiteText } from "@client/react/palette";
import ChatArea from "./ChatArea";

const useStyles = createUseStyles({
  root: {
    border: "1px solid black",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    width: 500,
    "&> *": {
      boxSizing: "border-box",
    },
  },
  tabContainer: {
    height: 36,
    marginBottom: 10,
  },
  tab: {
    float: "left",
    width: 100,
  },
  chatArea: {
    backgroundColor: "rgba(0,0,0,0.1)",
    boxShadow: "inset 0px 0px 10px rgba(0,0,0,0.5)",
    width: "100%",
  },
  textInput: {
    border: "none",
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    boxShadow: "inset 0px 0px 10px rgba(0,0,0,0.5)",
    width: "100%",
    outline: "none",
    ...whiteText,
  },
});

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.tabContainer}>
        <Button className={classes.tab} value="Nearby" />
        <Button className={classes.tab} value="Global" />
      </div>
      <div className={classes.chatArea}>
        <ChatArea />
      </div>
      <input className={classes.textInput} />
    </div>
  );
};
