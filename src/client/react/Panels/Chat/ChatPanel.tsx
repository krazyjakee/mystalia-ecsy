import React, { useState, useRef, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { Button } from "@client/react/FormControls/Button";
import { whiteText } from "@client/react/palette";
import ChatArea from "./ChatArea";
import { useGameEvent } from "@client/react/Hooks/useGameEvent";
import gameState from "@client/gameState";

const useStyles = createUseStyles({
  root: {
    position: "absolute",
    bottom: 64,
    left: 32,
    border: "1px solid #DFDFDF",
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
    border: "1px solid #DFDFDF",
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

  // TODO: Find somewhere to send a request and receive a response
  const [currentMap] = useGameEvent("localPlayer:currentMap:response", "chat");

  const roomName = currentMap?.mapName;

  const roomChatEvent = `chat:subscribe:${roomName}` as "chat:subscribe";
  const [localChat] = useGameEvent(roomChatEvent);
  const [globalChat] = useGameEvent(
    `chat:subscribe:global` as "chat:subscribe"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [tabs, setTabs] = useState<boolean[]>([false, true]);
  const setTab = (tab: number) => {
    if (tab) {
      setTabs([true, false]);
    } else {
      setTabs([false, true]);
    }
  };

  const send = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      const messageToSend = inputRef.current?.value;
      if (inputRef.current && messageToSend) {
        gameState.send(
          "map",
          `chat:publish:${tabs[1] ? roomName : "global"}` as "chat:publish",
          {
            message: messageToSend,
          }
        );
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    gameState.trigger("localPlayer:currentMap:request", undefined);
  }, [localChat, globalChat]);

  if (!roomName) return null;

  return (
    <div className={classes.root}>
      <div className={classes.tabContainer}>
        <Button
          className={classes.tab}
          value={roomName} // Change this back to "Nearby" after debugging
          onClick={() => setTab(0)}
        />
        <Button
          className={classes.tab}
          value="Global"
          onClick={() => setTab(1)}
        />
      </div>
      <div className={classes.chatArea}>
        <ChatArea stream={localChat} hide={tabs[0]} />
        <ChatArea stream={globalChat} hide={tabs[1]} />
      </div>
      <input ref={inputRef} className={classes.textInput} onKeyDown={send} />
    </div>
  );
};
