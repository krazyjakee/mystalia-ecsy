import React, { useState, useEffect } from "react";
import client from "../colyseus";
import startEcsy from "../ecsy";
import { Button } from "./FormControls/Button";
import { createUseStyles } from "react-jss";
import { whiteText } from "./palette";
import { guiAssetPath } from "./cssUtilities";

const useStyles = createUseStyles({
  title: {
    fontSize: 36,
    ...whiteText
  },
  mainMenu: {
    backgroundImage: guiAssetPath("backdrops/darknight.jpg"),
    backgroundPosition: "center center",
    width: "100vw",
    height: "100vh"
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -120,
    marginTop: -42.5,
    textAlign: "center",
    fontFamily: "Tahoma"
  }
});

export default () => {
  const classes = useStyles();
  const [hidden, setHidden] = useState(false);

  const hotReloadEnabled = Boolean((window as any).webpackHotUpdate);

  const login = async () => {
    let user = await client.auth.login();
    if (!user.username) {
      client.auth.logout();
      user = await client.auth.login();
    }
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
    <div className={classes.mainMenu}>
      <div className={classes.content}>
        <div className={classes.title}>Mystalia Online</div>
        <br />
        <Button value="Play" onClick={login} />
      </div>
    </div>
  );
};
