import * as React from "react";
import * as ReactDOM from "react-dom";
import MainMenu from "./react/MainMenu";
import { Clock } from "./react/Overlays/Clock";
import AdminPanel from "./react/Panels/Admin/AdminPanel";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  clickArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh"
  }
});

const App = () => {
  const classes = useStyles();

  return (
    <>
      <div id="click-area" className={classes.clickArea}></div>
      <MainMenu />
      <Clock />
      <AdminPanel />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("react-root"));
