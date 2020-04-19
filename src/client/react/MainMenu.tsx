import React, { useEffect } from "react";
import client from "../colyseus";
import startEcsy from "../ecsy";
import { Button } from "./FormControls/Button";
import { createUseStyles } from "react-jss";
import { whiteText } from "./palette";
import { guiAssetPath } from "./cssUtilities";

const useStyles = createUseStyles({
  title: {
    fontSize: 36,
    ...whiteText,
  },
  mainMenu: {
    backgroundImage: guiAssetPath("backdrops/darknight.jpg"),
    backgroundPosition: "center center",
    width: "100vw",
    height: "100vh",
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -120,
    marginTop: -42.5,
    textAlign: "center",
    fontFamily: "Tahoma",
  },
});

export default (props: { hidden: boolean; login: VoidFunction }) => {
  const classes = useStyles();

  const hotReloadEnabled = Boolean((window as any).webpackHotUpdate);

  const login = async () => {
    let user = await client.auth.login();
    if (!user.username) {
      client.auth.logout();
      user = await client.auth.login();
    }
    props.login();
    startEcsy(user);
  };

  useEffect(() => {
    if (hotReloadEnabled) {
      login();
    }
  }, []);

  return props.hidden || hotReloadEnabled ? null : (
    <div className={classes.mainMenu}>
      <div className={classes.content}>
        <div className={classes.title}>Mystalia Online</div>
        <br />
        <Button value="Play" onClick={login} />
      </div>
    </div>
  );
};
