import React, { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { GameStateEvents } from "types/gameState";
import { whiteText } from "@client/react/palette";

const useStyles = createUseStyles({
  root: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    height: 80,
    overflowX: "hidden",
    overflowY: "scroll",
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
  chatEntry: {
    margin: 0,
    padding: 0,
    ...whiteText,
  },
});

type Props = {
  stream?: GameStateEvents["chat:subscribe"];
  hide?: boolean;
};

export default ({ stream, hide = false }: Props) => {
  const classes = useStyles();
  const [messages, setMessages] = useState<GameStateEvents["chat:subscribe"][]>(
    []
  );
  const addMessage = () => {
    if (stream) {
      setMessages(messages.concat([stream]));
    }
  };

  useEffect(() => {
    addMessage();
  }, [stream]);

  if (hide) return null;

  return (
    <div className={classes.root}>
      {messages.reverse().map((message) => {
        return (
          <p className={classes.chatEntry}>
            <strong>{message.username}: </strong>
            {message.message}
          </p>
        );
      })}
    </div>
  );
};
