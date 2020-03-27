import React, { useState, useEffect } from "react";
import client from "../colyseus";
import startEcsy from "../ecsy";
import { Button } from "./FormControls/Button";
import { createUseStyles } from "react-jss";
import { whiteText } from "./palette";

const useStyles = createUseStyles({
  title: {
    fontSize: 36,
    ...whiteText
  }
});

export default () => {
  const classes = useStyles();
  const [hidden, setHidden] = useState(false);

  const hotReloadEnabled = Boolean((window as any).webpackHotUpdate);

  const login = async () => {
    const user = await client.auth.login();
    startEcsy(user);
    setHidden(true);
  };

  useEffect(() => {
    document.addEventListener("ws:close", () => {
      setHidden(false);
    });

    if (hotReloadEnabled) {
      login();
    }
  }, []);

  return hidden || hotReloadEnabled ? null : (
    <div className="mainMenu">
      <div className="mainMenu-container">
        <div className={classes.title}>Mystalia Online</div>
        <br />
        <Button value="Play" onClick={login} />
      </div>
    </div>
  );
};
