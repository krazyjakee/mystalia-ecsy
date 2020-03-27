import React, { useState, useEffect } from "react";
import client from "../colyseus";
import startEcsy from "../ecsy";

export default () => {
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
        <div className="title">Mystalia Online</div>
        <button className="btn" onClick={login}>
          Play
        </button>
      </div>
    </div>
  );
};
