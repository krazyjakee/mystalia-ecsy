import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import MainMenu from "./react/MainMenu";
import { Clock } from "./react/Overlays/Clock";
import AdminPanel from "./react/Panels/Admin/AdminPanel";
import { createUseStyles } from "react-jss";
import InventoryPanel from "./react/Panels/Inventory/InventoryPanel";
import TopMenu from "./react/Panels/TopMenu";
import gameState from "./gameState";
import { EnemyStatus } from "./react/Panels/EnemyStatus";
import ShopPanel from "./react/Panels/Shop/ShopPanel";
import { TargetedEnemyStatus } from "./react/Panels/Status/TargetedEnemyStatus";
import ChatPanel from "./react/Panels/Chat/ChatPanel";
import LootPanel from "./react/Panels/Loot";
import GameMenu from "./react/Panels/GameMenu";
import OptionsPanel from "./react/Panels/Options/OptionsPanel";
import CraftingPanel from "./react/Panels/Crafting/CraftingPanel";

const useStyles = createUseStyles({
  clickArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
  },
});

const App = () => {
  const classes = useStyles();
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
    gameState.subscribe("localPlayer:quit", () => {
      setInGame(false);
    });
  }, []);

  return (
    <>
      <div id="click-area" className={classes.clickArea}></div>
      <MainMenu hidden={inGame} login={() => setInGame(true)} />
      {inGame ? (
        <>
          <Clock />
          <AdminPanel />
          <InventoryPanel />
          <TopMenu />
          <EnemyStatus />
          <ShopPanel />
          <TargetedEnemyStatus />
          <ChatPanel />
          <LootPanel />
          <GameMenu logout={() => setInGame(false)} />
          <OptionsPanel />
          <CraftingPanel />
        </>
      ) : null}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("react-root"));
