import React, { useState } from "react";
import client from "../colyseus";
import startEcsy from "../ecsy";

export default () => {
  const [hidden, setHidden] = useState(false);

  const login = async () => {
    const user = await client.auth.login();
    startEcsy(user);
    setHidden(true);
  };

  return hidden ? null : (
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
